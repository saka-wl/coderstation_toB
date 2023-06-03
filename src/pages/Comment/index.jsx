import { PageContainer, ProTable } from '@ant-design/pro-components'
import { Button, Radio, Select, Tag, message } from 'antd'
import { useEffect, useRef, useState } from 'react'
import CommentController from '@/services/comment.js'
import UserController from '@/services/user'
import IssueController from '@/services/issue'
import BookController from '@/services/book'
import { useSelector } from 'umi'
import { useDispatch } from 'umi'
import { typeOptionCreator } from '@/utils/tool'

function Comment(props) {

  const actionRef = useRef()
  const [commentType, setCommentType] = useState(1)

  const [searchType, setSearchType] = useState({
    typeId: null
  })
  const [userArr, setUserArr] = useState([])
  const [titleArr, setTitleArr] = useState([])
  const dispatch = useDispatch()

  const {typeList} = useSelector(state => state.type)
  useEffect(() => {
    if(typeList.length === 0) {
      dispatch({
        type: 'type/_initTypeList'
      })
    }
  }, [typeList])

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5
  })

  const handleRadioChange = (val) => {
    setCommentType(val)
  }

  const handlePageChange = (current, pageSize) => {
    setPagination({
      current,
      pageSize
    })
  }
  const handleSelectChange = (val) => {
    setSearchType({
      typeId: val
    })
  }
  const handleDeleteClick = async (id) => {
    await CommentController.deleteComment(id)
    message.success("删除评论成功")
    actionRef.current.reload()
  }

  const columns = [
    {
      title: '序号',
      align: 'center',
      width: 50,
      search: false,
      render: (text, record, index) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1
      }
    },
    {
      title: commentType === 1 ? '问题标题' : '书籍标题',
      align: 'center',
      search: false,
      render: (_, row) => {
        const id = row?.issueId || row?.bookId
        const title = titleArr.find(it => it._id === id)
        return title?.issueTitle || title?.bookTitle
      }
    },
    {
      title: '评论内容',
      align: 'center',
      dataIndex: 'commentContent',
      key: 'commentContent',
      render: (_, row) => {
        // 将问答标题进行简化
        let brief = null;
        if (row.commentContent.length > 30) {
          brief = row.commentContent.slice(0, 30) + '...';
        } else {
          brief = row.commentContent;
        }
        return [brief];
      }
    },
    {
      title: '评论用户',
      align: 'center',
      dataIndex: 'userId',
      search: false,
      render: (_, row) => {
        let user = userArr.find(it => it._id === row.userId)
        return (
          <Tag color="blue" key={row.userId} >
            {user.nickname}
          </Tag>
        ) 
      }
    },
    {
      title: '评论分类',
      align: 'center',
      search: true,
      renderFormItem: () => {
        return (
          <Select placeholder='请选择查询分类' onChange={handleSelectChange}>
            {typeOptionCreator(Select, typeList)}
          </Select>
        )
      },
      render: (_, row) => {
        let type = typeList.find(it => it._id === row.typeId)
        return (
          <Tag color='purple' key={row.typeId}>
            {type?.typeName}
          </Tag>
        )
      }
    },
    {
      title: '操作',
      align: 'center',
      render: (_, row) => {
        return (
          <Button
            type='link'
            size='small'
            onClick={() => handleDeleteClick(row._id)}
          >
            删除
          </Button>
        )
      } 
    }
  ]

  return (
    <PageContainer>
      <Radio.Group onChange={handleRadioChange} defaultValue={1}>
        <Radio.Button value={1} defaultChecked>问答评论</Radio.Button>
        <Radio.Button value={2}>书籍评论</Radio.Button>
      </Radio.Group>
      <ProTable
        headerTitle='评论列表'
        columns={columns}
        actionRef={actionRef}
        params={searchType}
        rowKey={(row) => row._id}
        onReset={() => {
          setSearchType({
            typeId: null
          })
        }}
        pagination={{
          ...pagination,
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20, 50, 100],
          onChange: handlePageChange
        }}
        request={async (params) => {
          const {data, code} = await CommentController.getCommentByType(params, commentType)
          console.log(data)
          const tableData = data.data
          const userArr = []
          const titleArr = []
          for(let i=0;i<tableData.length;i++) {
            const {data} = await UserController.getUserById(
              tableData[i].userId
            )
            userArr.push(data)
            const id = tableData[i].issueId
            ? tableData[i].issueId
            : tableData[i].bookId
            if(commentType === 1) {
              const {data} = await IssueController.getIssueById(id)
              titleArr.push(data)
            }else {
              const {data} = await BookController.getBookById(id)
              titleArr.push(data)
            }
          }

          setUserArr(userArr)
          setTitleArr(titleArr)

          return {
            data: tableData,
            success: !code,
            total: data.count
          }

        }}
      >

      </ProTable>
    </PageContainer>
  )
}

export default Comment

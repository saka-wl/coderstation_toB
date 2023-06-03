import BookController from '@/services/book'
import { formatDate } from '@/utils/tool'
import { PageContainer, ProTable } from '@ant-design/pro-components'
import { Button, ConfigProvider, Popconfirm, Select, Tag, message } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'umi'
import { useNavigate } from '@umijs/max'

function Book(props) {
  const { typeList } = useSelector(state => state.type)
  const [searchType, setSearchType] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const actionRef = useRef()

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

  const handlePageChange = (current, pageSize) => {
    setPagination({
      current,
      pageSize
    })
  }

  const handleTypeChange = (value) => {
    setSearchType({
      typeId: value
    })
  }

  const options = typeList.map(it => {
    return (
      <Select.Option value={it._id} key={it._id}>{it.typeName}</Select.Option>
    )
  })

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
      title: '书籍名称',
      align: 'center',
      dataIndex: 'bookTitle',
      key: 'bookTitle'
    },
    {
      title: '书籍分类',
      align: 'center',
      dataIndex: 'typeId',
      key: 'typeId',
      renderFormItem: () => {
        return (
          <Select placeholder='请选择查询分类' onChange={handleTypeChange}>
            {options}
          </Select>
        )
      },
      render: (_, row) => {
        const item = typeList.find(it => it._id === row.typeId)
        return (
          <Tag color="purple" key={item?.typeId}>
            {item?.typeName}
          </Tag>
        )
      }
    },
    {
      title: '书籍简介',
      align: 'center',
      dataIndex: 'bookIntro',
      key: 'bookIntro',
      width: 200,
      search: false,
      render: (_, row) => {
        let reg = /<[^<>]+>/g
        let brief = row.bookIntro
        brief = brief.replace(reg, '')

        if (brief.length > 15) {
          brief = brief.slice(0, 15) + '...'
        }
        return [brief]
      }
    },
    {
      title: '书籍封面',
      align: 'center',
      valueType: 'image',
      key: 'bookPic',
      dataIndex: 'bookPic',
      search: false
    },
    {
      title: '浏览数',
      align: 'center',
      search: false,
      dataIndex: 'scanNumber',
      key: 'scanNumber'
    },
    {
      title: '评论数',
      align: 'center',
      search: false,
      dataIndex: 'commentNumber',
      key: 'commentNumber'
    },
    {
      title: '上架时间',
      align: 'center',
      search: false,
      dataIndex: 'onShelfDate',
      key: 'onShelfDate',
      render: (_, row) => {
        return <>{formatDate(row.onShelfDate)}</>
      }
    },
    {
      title: '操作',
      align: 'center',
      search: false,
      valueType: 'option',
      winth: 200,
      key: 'option',
      render: (_, row) => {
        return (
          <div>
            <Button type='link' size='small' onClick={() => handleEditClick(row)}>编辑</Button>
            <Popconfirm
              description="你确认要删除书籍吗？"
              onConfirm={() => handleConfirm(row)}
              okText="确认"
              cancelText="取消"
            >
              <Button type='link' size='small'>删除</Button>
            </Popconfirm>
          </div>
        )
      }
    }
  ]

  const handleEditClick = (row) => {
    navigate('/book/editBook/' + row._id)
  }
  const handleConfirm = async (row) => {
    await BookController.deleteBook(row._id)
    actionRef.current.reload()
    message.success('删除书籍成功')
  }

  return (
    <div>
      <PageContainer>
        <ProTable
          headerTitle="图书列表"
          columns={columns}
          params={searchType}
          actionRef={actionRef}
          rowKey={row => row._id}
          onReset={() => {
            setSearchType(null)
          }}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 15, 20],
            ...pagination,
            onChange: handlePageChange
          }}
          request={async params => {
            const result = await BookController.getBookByPage(params)
            return {
              data: result.data.data,
              // success 请返回 true，
              // 不然 table 会停止解析数据，即使有数据
              success: !result.code,
              // 不传会使用 data 的长度，如果是分页一定要传
              total: result.data.count
            }
          }}
        />
      </PageContainer>
    </div>
  )
}

export default Book

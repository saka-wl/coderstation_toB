import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useEffect, useRef, useState } from 'react';
import InterviewController from '@/services/interview'
import { Button, Popconfirm, Select, Tag, message } from 'antd';
import { useSelector } from 'umi';
import { useDispatch } from 'umi';
import { formatDate } from '@/utils/tool';
import { useNavigate } from '@umijs/max';

function Interview(props) {

  const navigate = useNavigate()

  const actionRef = useRef()
  const dispatch = useDispatch()
  const [searchType, setSearchType] = useState()
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5
  })

  const {typeList} = useSelector(state => state.type)

  useEffect(() => {
    if(typeList.length === 0) {
      dispatch({
        type: 'type/_initTypeList'
      })
    }
  }, [typeList])

  const handlePageChange = (current, pageSize) => {
    setPagination({
      current,
      pageSize
    })
  }

  const deleteHandle = async (id) => {
    await InterviewController.deleteInterview(id)
    actionRef.current.reload()
    message.success('删除成功')
  }

  const options = typeList.map(it => {
    return (
      <Select.Option value={it._id} key={it._id}>{it.typeName}</Select.Option>
    )
  })

  const handleTypeChange = (value) => {
    setSearchType({
      typeId: value
    })
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
      title: '题目名称',
      align: 'center',
      dataIndex: 'interviewTitle',
      key: 'interviewTitle'
    },
    {
      title: '题目分类',
      align: 'center',
      dataIndex: 'typeId',
      key: 'typeId',
      renderFormItem: () => {
        return (
          <Select placeholder="请选择查询分类" onChange={handleTypeChange}>
            {options}
          </Select>
        )
      },
      render: (_, row) => {
        const item = typeList.find(it => it._id === row.typeId)
        return (
          <Tag color='purple' key={item?.typeId}>
            {item?.typeName}
          </Tag>
        )
      }
    },
    {
      title: '上架日期',
      align: 'center',
      dataIndex: 'onShelfDate',
      key: 'onShelfDate',
      render: (_, {onShelfDate}) => {
        return (
          <div>
            {formatDate(onShelfDate)}
          </div>
        )
      }
    },
    {
      title: '操作',
      align: 'center',
      key: 'option',
      valueType: 'option',
      render: (_, row) => {
        return (
          <div>
            <Button 
              type='link'
              size='small'
              onClick={() => navigate('/interview/interviewList/' + row._id)}
            >
              详情
            </Button>
            <Button 
              type='link'
              size='small'
              onClick={() => navigate('/interview/interviewEdit/' + row._id)}
            >
              编辑
            </Button>
            <Popconfirm
              title="是否要删除该面试题？"
              onConfirm={() => deleteHandle(row._id)}
              okText="删除"
              cancelText="取消"
            >
              <Button 
                type='link'
                size='small'
              >
                删除
              </Button>
            </Popconfirm>
          </div>
        )
      }
    }
  ]

  return (
    <div>
      <PageContainer>
        <div>
          <ProTable 
            headerTitle='题目列表'
            columns={columns}
            rowKey={row => row._id}
            actionRef={actionRef}
            params={searchType}
            pagination={{
              showQuickJumper: true,
              showSizeChanger: true,
              pageSize: [5, 10, 15],
              ...pagination,
              onChange: handlePageChange
            }}
            onReset={() => {
              setSearchType({
                typeId: null,
              })
            }}
            request={async params => {
              const resp = await InterviewController.getInterviewByPage(params)
              return {
                data: resp.data.data,
                success: resp?.code,
                total: resp.data.count
              }
            }}
          />
        </div>
      </PageContainer>
    </div>
  );
}

export default Interview;
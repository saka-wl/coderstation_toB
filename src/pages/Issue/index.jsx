import { PageContainer, ProTable } from '@ant-design/pro-components';
import React, { useEffect, useRef, useState } from 'react';
import IssueController from '@/services/issue'
import { Button, Popconfirm, Select, Switch, Tag, message } from 'antd';
import { typeOptionCreator } from '@/utils/tool';
import { useNavigate, useSelector } from 'umi';
import { useDispatch } from 'umi';

function Issue(props) {

  const actionRef = useRef()

  const {typeList} = useSelector(state => state.type)
  const dispatch = useDispatch()
  const navigate = useNavigate()

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
  const [searchType, setSearchType] = useState({
    typeId: null
  })

  const handlePageChange = (current, pageSize) => {
    setPagination({
      current,
      pageSize
    })
  }

  const handleParamsChange = (val) => {
    setSearchType({
      typeId: val
    })
  }
  const switchChange = async (row, val) => {
    await IssueController.editIssue(row._id, {
      issueStatus: val
    })
    message.success("审核成功！")
  }
  const deleteHandle = (row) => {
    IssueController.deleteIssue(row._id)
    actionRef.current.reload()
    message.success('删除问答成功');
  }

  const columns = [
    {
      title: '序号',
      align: 'center',
      search: false,
      render: (text, record, index) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1
      }
    },
    {
      title: "问答标题",
      align: 'center',
      search: true,
      dataIndex: "issueTitle"
    },
    {
      title: '问答描述',
      align: 'center',
      search: false,
      render: (_, row) => {
        console.log(row)
        let reg = /<[^<>]+>/g;
        let brief = row.issueContent;
        brief = brief.replace(reg, '');

        if (brief.length > 30) {
          brief = brief.slice(0, 30) + '...';
        }
        return [brief];
      }
    },
    {
      title: '浏览数',
      align: 'center',
      search: false,
      dataIndex: 'commentNumber'
    },
    {
      title: '评论数',
      align: 'center',
      search: false,
      dataIndex: 'scanNumber'
    },
    {
      title: '问题分类',
      align: 'center',
      dataIndex: 'typeId',
      key: 'typeId',
      renderFormItem: () => {
        return (
          <Select placeholder='请选择查询分类' onChange={handleParamsChange}>
            {typeOptionCreator(Select, typeList)}
          </Select>
        )
      },
      render: (_, row) => {
        const type = typeList.find((item) => item._id === row.typeId);
        return (
          <Tag
           color="purple" key={row.typeId}>
            {type.typeName}
          </Tag>
        )
      }
    },
    {
      title: '审核状态',
      align: 'center',
      search: false,
      render: (_, row) => {
        return (
        <Switch
          key={row._id}
          defaultChecked={row.issueStatus}
          size="small"
          onChange={(value) => switchChange(row, value)}
        />
      )
      }
    },
    {
      title: '操作',
      align: 'center',
      search: false,
      render: (_, row) => {
        return (
          <div key={row._id}>
            <Button
              type="link"
              size="small"
              onClick={() => navigate(`/issue/${row._id}`)}
            >
              详情
            </Button>
            <Popconfirm
              title="是否要删除该问答以及该问答对应的评论？"
              onConfirm={() => deleteHandle(row)}
              okText="删除"
              cancelText="取消"
            >
              <Button type="link" size="small">
                删除
              </Button>
            </Popconfirm>
          </div>
        )
      }
    }
  ]

  return (
    <PageContainer>
      <ProTable
        headerTitle='问答列表'
        columns={columns}
        rowKey={row => row._id}
        actionRef={actionRef}
        params={searchType}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          pageSize: true,
          ...pagination,
          onChange: handlePageChange
        }}
        onReset={() => {

        }}
        request={async params => {
          const {data, code} = await IssueController.getIssueByPage(params)
          console.log(data)
          return {
            data: data.data,
            success: !code,
            total: data.count
          }
        }}
      >

      </ProTable>
    </PageContainer>
  );
}

export default Issue;
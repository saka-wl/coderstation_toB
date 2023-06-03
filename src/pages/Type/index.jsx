import { PageContainer, ProTable } from '@ant-design/pro-components'
import { useDispatch, useSelector } from '@umijs/max'
import { Button, Form, Input, Popconfirm, message } from 'antd'
import { useEffect, useState } from 'react'

function Type(props) {
  const [value, setValue] = useState('')
  const dispatch = useDispatch()
  const { typeList } = useSelector(state => state.type)

  useEffect(() => {
    if (typeList.length === 0) {
      dispatch({
        type: 'type/_initTypeList'
      })
    }
  }, [typeList])

  const handleIptChange = val => {
    setValue(val)
  }

  const addHandle = () => {
    if (typeList.find(it => it.typeName === value)) {
      message.warning('该分类已有')
    } else {
      dispatch({
        type: 'type/_addType',
        payload: {
          typeName: value
        }
      })
      message.success('增加分类成功')
    }
  }

  const deleteHandle = row => {
    dispatch({
      type: 'type/_deleteType',
      payload: row
    })
    message.success('删除分类成功')
  }

  const columns = [
    {
      title: '分类名称',
      dataIndex: 'typeName',
      key: 'typeName',
      align: 'center',
      editable: true
    },
    {
      title: '操作',
      width: 200,
      align: 'center',
      key: 'option',
      render: (_, row, index) => {
        return (
          <div key={row._id}>
            <Popconfirm title="你确定要删除吗？" onConfirm={() => deleteHandle(row)} okText="删除" cancelText="取消">
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
      <div style={{ marginBottom: 30 }}>
        <Form layout="inline">
          <Form.Item>
            <Input placeholder="填写新增类型" value={value} onChange={e => handleIptChange(e.target.value)} style={{ width: 200 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" shape="round" onClick={addHandle}>
              新增
            </Button>
          </Form.Item>
        </Form>
      </div>

      <ProTable
        headerTitle="分类信息"
        columns={columns}
        dataSource={typeList}
        rowKey={row => row._id}
        search={false}
        pagination={{
          pageSize: 5
        }}
      ></ProTable>
    </PageContainer>
  )
}

export default Type

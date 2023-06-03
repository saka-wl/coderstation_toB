import { PageContainer } from '@ant-design/pro-components';
import { useParams } from '@umijs/max';
import React, { useEffect, useState } from 'react';
import IssueController from '@/services/issue'
import UserController from '@/services/user'
import { useDispatch, useSelector } from '@umijs/max';
import { Card, Tag } from 'antd';
import { formatDate } from '@/utils/tool';

function DetailIssue(props) {

  const {id} = useParams()
  const dispatch = useDispatch()

  const [issueInfo, setIssueInfo] = useState(null)
  const [user, setUser] = useState(null)
  const [typeName, setTypeName] = useState(null)
  const {typeList} = useSelector(state => state.type)

  // useEffect(() => {
  //   if(typeList.length === 0) {
  //     dispatch({
  //       type: 'type/_initTypeList'
  //     })
  //   }
  // }, [typeList])

  useEffect(() => {
    const fetchData = async () => {
      const {data} = await IssueController.getIssueById(id)
      const user = await UserController.getUserById(data.userId)
      setIssueInfo(data)
      setUser(user.data)
      if(typeList.length === 0) {
        await dispatch({
          type: 'type/_initTypeList'
        })
      }
      const type = typeList.find(it => it._id === data.typeId)
      setTypeName(type?.typeName)
    }
    if(id) fetchData();
  }, [id, typeList])

  return (
    <PageContainer>
    <div
      className="container"
      style={{
        width: '100%',
        margin: 'auto',
      }}
    >
      <Card
        title={issueInfo?.issueTitle}
        bordered={false}
        style={{
          marginTop: 20,
        }}
        extra={
          <Tag color="purple" key={issueInfo?.typeId}>
            {typeName}
          </Tag>
        }
      >
        <h2>提问用户</h2>
        <p>
          <Tag color="volcano" key={issueInfo?.userId}>
            {user?.nickname}
          </Tag>
        </p>
        <h2>问题描述</h2>
        <p>
          <div
            dangerouslySetInnerHTML={{ __html: issueInfo?.issueContent }}
          ></div>
        </p>
        <h2>提问时间</h2>
        <p>{formatDate(issueInfo?.issueDate)}</p>
        <h3>浏览数：{issueInfo?.scanNumber}</h3>
        <p></p>
        <h3>评论数：{issueInfo?.scanNumber}</h3>
      </Card>
    </div>
  </PageContainer>
  );
}

export default DetailIssue;
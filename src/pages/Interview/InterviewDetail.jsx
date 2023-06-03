import React, { useEffect, useState } from 'react';
import InterviewController from '@/services/interview'
import { Card, Tag } from 'antd';
import { useSelector, useDispatch, useParams } from '@umijs/max';

function InterviewDetail(props) {

  const {id} = useParams()
  const [interviewInfo, setInterviewInfo] = useState(null)
  const [tagName, setTagName] = useState(null)
  const {typeList} = useSelector(state => state.type)
  const dispatch = useDispatch()

  useEffect(() => {
    if(typeList.length === 0) {
      dispatch({
        type: 'type/_initTypeList'
      })
    }
  }, [typeList])

  useEffect(() => {
    async function fetchData() {
      const {data} = await InterviewController.getInterviewById(id)
      setInterviewInfo(data)
      let item = typeList.find(it => it._id === data.typeId)
      setTagName(item.typeName)
    }
    if(id && typeList.length !== 0) fetchData()
  }, [id, typeList])


  return (
    <div>
      <Card title={interviewInfo?.interviewTitle} extra={<Tag color='purple'>{tagName}</Tag>} style={{ width: '90%' }}>
        <div dangerouslySetInnerHTML={{__html: interviewInfo?.interviewContent}}></div>
      </Card>
    </div>
  );
}

export default InterviewDetail;
import { PageContainer } from '@ant-design/pro-components';
import InterviewForm from './component/InterviewForm';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from '@umijs/max';
import InterviewController from '@/services/interview';
import { message } from 'antd';

function EditInterview(props) {

  const {id} = useParams()
  const [newInterviewInfo, setNewInterviewInfo] = useState({
    interviewTitle: '',
    interviewContent: '',
    typeId: '',
  });
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      const {data} = await InterviewController.getInterviewById(id)
      setNewInterviewInfo({
        interviewTitle: data.interviewTitle,
        interviewContent: data.interviewContent,
        typeId: data.typeId
      })
    }
    if(id) fetchData();
  }, [id])

  const handleSubmit = (interviewContent) => {
    InterviewController.editInterview(id, {
      interviewTitle: newInterviewInfo.interviewTitle,
      interviewContent,
      typeId: newInterviewInfo.typeId,
    });
    // 跳转回首页
    navigate('/interview/interviewList');
    message.success('修改题目成功');
  }

  return (
    <PageContainer>
      <div>
        <InterviewForm 
          type="edit"
          interviewInfo={newInterviewInfo}
          setInterviewInfo={setNewInterviewInfo}
          handleSubmit={handleSubmit}
        />
      </div>
    </PageContainer>
  );
}

export default EditInterview;
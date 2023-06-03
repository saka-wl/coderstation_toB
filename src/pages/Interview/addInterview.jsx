import React, { useState } from 'react';
import InterviewForm from './component/InterviewForm'
import { PageContainer } from '@ant-design/pro-components';
import InterviewController from '@/services/interview'
import { useNavigate } from '@umijs/max';
import { message } from 'antd';

function addInterview(props) {
  const [newInterviewInfo, setNewInterviewInfo] = useState({
    interviewTitle: '',
    interviewContent: '',
    typeId: '',
  });

  const navigate = useNavigate()

  const handleSubmit = (interviewContent) => {
    InterviewController.addInterview({
      interviewTitle: newInterviewInfo.interviewTitle,
      interviewContent,
      typeId: newInterviewInfo.typeId,
    });
    // 跳转回首页
    navigate('/interview/interviewList');
    message.success('新增题目成功');
  }

  return (
    <PageContainer>
      <div>
        <InterviewForm 
          type="add"
          interviewInfo={newInterviewInfo}
          setInterviewInfo={setNewInterviewInfo}
          handleSubmit={handleSubmit}
        />
      </div>
    </PageContainer>
  );
}

export default addInterview;
import React, { useRef } from 'react';

function Test({type, interviewInfo}) {
  const formRef = useRef()
  // 这里的 if 什么时候执行？
  if(type === 'add') {
    if (formRef.current) {
      formRef.current.setFieldsValue(interviewInfo);   // antd里面的更新表单form
    }
  }
  return (
    <Form
      name='basic'
      initialValues={interviewInfo}
      autoComplete='off'
      onFinish={addInterview}
      ref={formRef}
    >
      {/* ... */}
    </Form>
  );
}

export default Test;
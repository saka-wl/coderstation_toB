import React, { useEffect, useRef, useState } from 'react';
import {Button, Form, Input, Select} from 'antd'
import { useSelector, useDispatch } from 'umi';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/zh-cn';
import { Editor } from '@toast-ui/react-editor';

function InterviewForm({type, interviewInfo, setInterviewInfo, handleSubmit}) {
  
  const {typeList} = useSelector(state => state.type)
  const [firstIn, setFirstIn] = useState(true)

  const editorRef = useRef()
  const formRef = useRef()
  
  if (type === 'edit') {
    if (formRef.current && firstIn) {
      setFirstIn(false);
      editorRef.current.getInstance().setHTML(interviewInfo?.interviewContent);
    }
    if (formRef.current) {
      formRef.current.setFieldsValue(interviewInfo);
    }
  }

  const dispatch = useDispatch()
  useEffect(() => {
    if(typeList.length === 0) {
      dispatch({
        type: 'type/_initTypeList'
      })
    }
  }, [typeList])
  
  const addInterview = () => {
    const content = editorRef.current.getInstance().getHTML()
    handleSubmit(content)
  }

  const options = typeList.map(it => {
    return (
      <Select.Option value={it._id} key={it._id}>{it.typeName}</Select.Option>
    )
  })

  const updateInfo = (value, key) => {
    let obj = {...interviewInfo}
    obj[key] = value
    setInterviewInfo(obj)
  }
  
  return (
    <Form
      name='basic'
      initialValues={interviewInfo}
      autoComplete='off'
      onFinish={addInterview}
      ref={formRef}
    >
      <Form.Item
        label='题目标题'
        name='interviewTitle'
        rules={[
          {required: true, message: '标题不能为空！'}
        ]}
        style={{ width: '80%' }}
      >
        <Input 
          placeholder='填写题目标题'
          value={interviewInfo?.interviewTitle}
          onChange={(e) => updateInfo(e.target.value, 'interviewTitle')}
        />
      </Form.Item>
      <Form.Item
        label='题目分类'
        name='typeId'
        rules={[
          {required: true, message: '分类不能为空！'}
        ]}
        style={{
          width: 300
        }}
      >
        <Select
          onChange={(val) => updateInfo(val, 'typeId')}
          value={interviewInfo?.typeId}
          allowClear
        >
          {options}
        </Select>
      </Form.Item>
      <Form.Item
        label='题目内容'
        name='interviewContent'
        style={{ width: '80%' }}
      >
        <Editor
          previewStyle="vertical" 
          height="600px" 
          initialEditType="markdown" 
          useCommandShortcut={true} 
          language="zh-CN" 
          ref={editorRef} 
        />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 2, span: 16 }}>
        <Button type="primary" htmlType="submit">
          {type === 'add' ? '确认新增' : '修改'}
        </Button>

        <Button type="link" htmlType="submit" className="resetBtn">
          重置
        </Button>
      </Form.Item>
    </Form>
  );
}

export default InterviewForm;
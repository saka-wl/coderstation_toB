import { Editor } from '@toast-ui/react-editor'
import { Button, Form, Input, Select, Upload, Image } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { typeOptionCreator } from '@/utils/tool'
import { useSelector } from 'umi'
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/zh-cn';
import { useDispatch } from 'umi'

function BookForm({bookInfo, setBookInfo, submitHandle, type}) {

  const {typeList} = useSelector(state => state.type)
  const editorRef = useRef()
  const formRef = useRef()
  const dispatch = useDispatch()
  const [firstIn, setFirstIn] = useState(true)

  if (type === 'edit') {
    if (formRef.current && firstIn) {
      setFirstIn(false);
      editorRef.current.getInstance().setHTML(bookInfo?.bookIntro);
    }
    if (formRef.current) {
      formRef.current.setFieldsValue(bookInfo);
    }
  }

  useEffect(() => {
    if(typeList.length === 0) {
      dispatch({
        type: 'type/_initTypeList'
      })
    }
  }, [typeList])

  const updateInfo = (value, key) => {
    const obj = {...bookInfo}
    obj[key] = value
    setBookInfo(obj)
  }

  const handlePointChange = (value) => {
    updateInfo(value, 'requirePoints')
  }

  const addHandle = () => {
    const content = editorRef.current.getInstance().getHTML()
    submitHandle(content)
  }

  const handleTypeChange = (value) => {
    updateInfo(value, 'typeId')
  }

  let bookPicPreview = null
  if (type === 'edit') {
    bookPicPreview = (
      <Form.Item label="当前封面" name="bookPicPreview">
        <Image src={bookInfo?.bookPic} width={100} />
      </Form.Item>
    );
  }

  return (
    <div style={{
      margin: 20
    }}>
      <Form name="basic" initialValues={bookInfo} autoComplete="off" ref={formRef} onFinish={addHandle}>
        <Form.Item label="书籍标题" name="bookTitle" rules={[{ required: true, message: '请输入书名' }]}>
          <Input value={bookInfo?.bookTitle} onChange={e => updateInfo(e.target.value, 'bookTitle')} />
        </Form.Item>

        <Form.Item label="书籍介绍" name="bookIntro" rules={[{ required: true, message: '请输入书本相关的介绍' }]}>
          <Editor 
            previewStyle="vertical" 
            height="600px" 
            initialEditType="markdown" 
            useCommandShortcut={true} 
            language="zh-CN" 
            ref={editorRef} 
          />
        </Form.Item>

        <Form.Item label="下载链接" name="downloadLink" rules={[{ required: true, message: '请输入书籍链接' }]}>
          <Input value={bookInfo?.downloadLink} onChange={e => updateInfo(e.target.value, 'downloadLink')} />
        </Form.Item>

        <Form.Item label="所需积分" name="requirePoints" rules={[{ required: true, message: '请选择下载所需积分' }]}>
          <Select style={{ width: 200 }} onChange={handlePointChange}>
            <Select.Option value={20} key={20}>
              20
            </Select.Option>
            <Select.Option value={30} key={30}>
              30
            </Select.Option>
            <Select.Option value={40} key={40}>
              40
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="书籍分类" name="typeId" rules={[{ required: true, message: '请选择书籍分类' }]}>
          <Select style={{ width: 200 }} onChange={handleTypeChange}>
            {typeOptionCreator(Select, typeList)}
          </Select>
        </Form.Item>

        {bookPicPreview}

        <Form.Item label="书籍封面" valuePropName="fileList">
          <Upload
            action="/api/upload"
            listType="picture-card"
            maxCount={1}
            onChange={e => {
              if (e.file.status === 'done') {
                // 说明上传已经完成
                const url = e.file.response.data
                updateInfo(url, 'bookPic')
              }
            }}
          >
            +
          </Upload>
        </Form.Item>

        {/* 确认修改按钮 */}
        <Form.Item wrapperCol={{ offset: 3, span: 16 }}>
          <Button type="primary" htmlType="submit">
            {type === 'add' ? '确认新增' : '修改'}
          </Button>

          <Button type="link" htmlType="submit" className="resetBtn">
            重置
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default BookForm

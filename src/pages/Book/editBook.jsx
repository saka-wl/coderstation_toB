import React, { useEffect, useState } from 'react';
import BookForm from './component/BookForm';
import { PageContainer } from '@ant-design/pro-components';
import { useNavigate, useParams } from '@umijs/max';
import BookController from '@/services/book'
import { message } from 'antd';

function editBook(props) {

  const navigate = useNavigate()
  const {id} = useParams()
  const [bookInfo, setBookInfo] = useState({
    bookTitle: '',
    bookIntro: '',
    downloadLink: '',
    requirePoints:'',
    bookPic: '',
    typeId: ''
  })

  useEffect(() => {
    async function fetchData() {
      const {data} = await BookController.getBookById(id)
      setBookInfo(data)
    }
    if(id) fetchData();
  }, [])

  const submitHandle = (bookIntro) => {
        // 因为没有使用状态机，所以直接调用控制器方法，进行新增
        BookController.editBook(id, {
          bookTitle: bookInfo.bookTitle,
          bookIntro,
          downloadLink: bookInfo.downloadLink,
          requirePoints:bookInfo.requirePoints,
          bookPic: bookInfo.bookPic,
          typeId: bookInfo.typeId,
        });
        // 跳转回首页
        navigate('/book/bookList');
        message.success('书籍信息修改成功');
  }

  return (
    <PageContainer style={{margin: 20}}>
      <div className="container" style={{ width: 800 }}>
        <BookForm
          type="edit"
          submitHandle={submitHandle}
          bookInfo={bookInfo}
          setBookInfo={setBookInfo}
        />
      </div>
    </PageContainer>
  );
}

export default editBook;
import React, { useState } from 'react';
import BookForm from './component/BookForm'
import { PageContainer } from '@ant-design/pro-components';
import BookController from '@/services/book'
import { useNavigate } from '@umijs/max';
import { message } from 'antd';

function AddBook(props) {

  const navigate = useNavigate()
  const [newBookInfo, setNewBookInfo] = useState({
    bookTitle: '',
    bookIntro: '',
    downloadLink: '',
    requirePoints:'',
    bookPic: '',
    typeId: ''
  })

  const submitHandle = (bookIntro) => {
    BookController.addBook({
      bookTitle: newBookInfo.bookTitle,
      bookIntro,
      downloadLink: newBookInfo.downloadLink,
      requirePoints:newBookInfo.requirePoints,
      bookPic: newBookInfo.bookPic,
      typeId: newBookInfo.typeId,
    })
    message.success("添加书籍成功！")
    navigate('/book/bookList')
  }

  return (
    <PageContainer>
      <div className='container' style={{width: 1000}}>
        <BookForm 
          type='add'
          bookInfo={newBookInfo}
          setBookInfo={setNewBookInfo}
          submitHandle={submitHandle}
        />
      </div>
    </PageContainer>
  );
}

export default AddBook;
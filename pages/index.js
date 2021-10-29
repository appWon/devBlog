import React from 'react'
import Item from '../components/Item'
import SkeletonItem from '../components/skeletonItem'
import { API } from 'aws-amplify'
import { Container } from '@mui/material'
import { listPosts } from '../graphql/queries'

const Page = props => {
  const { posts } = props

  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {posts.map(post => (
        <Item
          key={`post_${post.id}`}
          id={post.id}
          tags={post.tags}
          title={post.title}
          markDown={post.markDown}
          createdAt={post.createdAt}
          description={post.description}
        />
      ))}
    </Container>
  )
}

export default Page

export const getServerSideProps = async () => {
  try {
    const { data } = await API.graphql({
      query: listPosts,
      authMode: 'AWS_IAM',
    })

    return {
      props: { posts: data.listPosts.items },
    }
  } catch (err) {
    console.log('error : ', err)
  }
}

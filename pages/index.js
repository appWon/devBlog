import React from 'react'
import Item from '../components/Item'
import SkeletonItem from '../components/skeletonItem'
import { API } from 'aws-amplify'
import { Container } from '@mui/material'
import { listPosts } from '../graphql/queries'

const Page = () => {
  const [posts, setPosts] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  const fetchPosts = async () => {
    setLoading(true)

    try {
      const { data } = await API.graphql({
        query: listPosts,
        authMode: 'AWS_IAM',
      })

      setPosts(data.listPosts.items)
    } catch (err) {
      console.log('error : ', err)
    }

    setLoading(false)
  }

  React.useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {!loading
        ? posts.map(post => (
            <Item
              key={`post_${post.id}`}
              id={post.id}
              tags={post.tags}
              title={post.title}
              markDown={post.markDown}
              createdAt={post.createdAt}
              description={post.description}
            />
          ))
        : [...Array(3)].map((_, i) => <SkeletonItem key={`skeleton_${i}`} />)}
    </Container>
  )
}

export default Page

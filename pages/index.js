import React from 'react'
import Item from '../components/Item'
import SkeletonItemfrom from '../components/skeletonItem'
import { API, graphqlOperation } from 'aws-amplify'
import { Container, Box } from '@mui/material'
import { listPosts } from '../graphql/queries'

const Page = () => {
  const [posts, setPosts] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  const fetchPosts = async () => {
    setLoading(true)

    try {
      const { data } = await API.graphql(graphqlOperation(listPosts))
      console.log(data)
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
            />
          ))
        : [...Array(3)].map((_, i) => (
            <SkeletonItemfrom key={`skeleton_${i}`} />
          ))}
    </Container>
  )
}

export default Page

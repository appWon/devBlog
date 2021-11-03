import React from 'react'
import { API } from 'aws-amplify'
import { useRouter } from 'next/router'
import { Container, Typography, Box, Button } from '@mui/material'
import { formatDate } from '../../lib/formatTime'
import { deletePost } from '../../graphql/mutations'
import { listPosts, getPost } from '../../graphql/queries'
import { MarkDown } from '../../components/markDown'
import { NextSeo } from 'next-seo'

const Post = ({ post }) => {
  const { push } = useRouter()
  const { id, tags, title, createdAt, markDown, description } = post

  const handleClickUpdate = () => {
    push({
      pathname: `/write`,
      post,
    })
  }

  const handleClickDelete = async () => {
    try {
      await API.graphql({
        query: deletePost,
        variables: { input: { id } },
      })

      push({
        pathname: `/`,
      })
    } catch (err) {
      alert('권한이 없습니다.')
    }
  }

  return (
    <>
      <NextSeo
        description={description}
        title={`${title} - JJ Dev Blog`}
        canonical={`https://jjblog.ga/post/${id}`}
        openGraph={{
          url: `https://jjblog.ga/post/${id}`,
          title: `${title} - JJ Dev Blog`,
          description,
          images: [
            {
              url: 'https://images.velog.io/images/app235/post/5d7839b2-a362-450b-a67d-876f42d5bc0f/thumbnail.png',
              width: 800,
              height: 600,
              alt: `JJ개발 블로그 이미지`,
            },
          ],
        }}
      />
      <Container
        maxWidth="md"
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        <Box>
          <Button
            onClick={handleClickUpdate}
            sx={{ justifyContent: 'start', minWidth: 'auto' }}
          >
            수정
          </Button>
          <Button
            onClick={handleClickDelete}
            sx={{ justifyContent: 'start', minWidth: 'auto' }}
          >
            삭제
          </Button>
        </Box>
        <Box sx={{ paddingBottom: 3 }}>
          <Box sx={{ display: 'flex', padding: '0 8px' }}>
            {typeof tags === 'object' ? (
              tags.map(tag => (
                <Typography
                  key={`${id}_${tag}`}
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 400,
                    marginRight: 1,
                  }}
                >
                  #{tag}
                </Typography>
              ))
            ) : (
              <Typography
                key={`${id}_${tags}`}
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  marginRight: 1,
                }}
              >
                #{tags}
              </Typography>
            )}
          </Box>
          <Typography
            component="h1"
            sx={{ fontSize: '2.5rem', fontWeight: 600, lineHeight: 1.3 }}
          >
            {title}
          </Typography>
          <Typography>{formatDate(createdAt)}</Typography>
        </Box>
        <MarkDown>{markDown}</MarkDown>
      </Container>
    </>
  )
}

export default Post

export const getStaticPaths = async () => {
  const { data } = await API.graphql({
    query: listPosts,
    authMode: 'AWS_IAM',
  })

  const paths = data.listPosts.items.map(post => ({ params: { id: post.id } }))
  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps = async ({ params }) => {
  const { id } = params
  const { data } = await API.graphql({
    query: getPost,
    variables: { id },
    authMode: 'AWS_IAM',
  })

  return {
    props: { post: data.getPost },
  }
}

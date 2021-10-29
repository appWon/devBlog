import {
  Typography,
  CardHeader,
  CardContent,
  Avatar,
  Card,
  Box,
} from '@mui/material'
import { useRouter } from 'next/router'
import { formatDate } from '../lib/formatTime'

const Item = ({ id, tags, title, createdAt, description }) => {
  const router = useRouter()

  const handleClickItem = id => {
    router.push({
      pathname: `post/${id}`,
      // query: { id, tags, title, markDown, createdAt, description },
    })
  }

  return (
    <Card sx={{ display: 'flex', marginBottom: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: { sm: '100%', xs: 350 },
          padding: {
            sm: 2,
            xs: 1,
          },
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              sx={{ bgcolor: 'black', width: '30px', height: '30px' }}
              aria-label="recipe"
            >
              JJ
            </Avatar>
          }
          title="주인장"
          subheader={formatDate(createdAt)}
          sx={{ padding: 1, fontSize: '0.875rem' }}
        />
        <CardContent
          onClick={() => handleClickItem(id)}
          sx={{
            cursor: 'pointer',
            ':hover': {
              color: '#1973E8',
            },
          }}
        >
          <Box sx={{ display: 'flex' }}>
            {tags.length
              ? tags.map(tag => (
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
              : ''}
          </Box>
          <Typography
            component="h2"
            variant="h5"
            sx={{
              fontSize: { sm: '1.75rem', xs: '1rem' },
              fontWeight: 600,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: '0.875rem',
              fontWeight: 300,
            }}
          >
            {description || ''}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  )
}

export default Item

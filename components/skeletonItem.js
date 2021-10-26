import {
  Typography,
  CardHeader,
  CardContent,
  Avatar,
  Card,
  Box,
  Skeleton,
} from '@mui/material'

const SkeletonItem = () => {
  return (
    <Card
      sx={{
        marginBottom: 4,
        padding: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <Box sx={{ display: 'flex', width: '200px', marginBottom: 2 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ width: '100%', marginLeft: 2 }}>
            <Skeleton variant="text" />
            <Skeleton variant="text" />
          </Box>
        </Box>
        <Skeleton variant="text" sx={{ width: { sm: '40%', xs: '100%' } }} />
        <Skeleton
          variant="text"
          sx={{ width: { sm: '80%', xs: '100%' }, height: '40px' }}
        />
        <Skeleton variant="text" sx={{ width: { sm: '80%', xs: '100%' } }} />
      </Box>
    </Card>
  )
}

export default SkeletonItem

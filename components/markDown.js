import React from 'react'
import ReactMarkDown from 'react-markdown'
import styled from '@emotion/styled'
import Snackbar from '@mui/material/Snackbar'
import gfm from 'remark-gfm'
import { ContentCopy } from '@mui/icons-material'
import 'github-markdown-css/github-markdown.css'

export const MarkDown = ({ children }) => {
  const [open, setOpen] = React.useState(false)

  const handleClickCopy = async ({ props }) => {
    try {
      await navigator.clipboard.writeText(props.children[0])
      setOpen(true)
    } catch (err) {
      console.log(err)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <ReactMarkDown
        style={{ position: 'relative' }}
        className="markdown-body p-3"
        remarkPlugins={[gfm]}
        skipHtml={true}
        components={{
          pre({ className, children, ...props }) {
            return (
              <Pre className={className} {...props}>
                {children}
                <IconContainer onClick={() => handleClickCopy(children[0])}>
                  <ContentCopy />
                </IconContainer>
              </Pre>
            )
          },
        }}
      >
        {children}
      </ReactMarkDown>
      <Snackbar
        open={open}
        severity="success"
        message={'복사하였습니다.'}
        onClose={handleClose}
        autoHideDuration={1000}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      />
    </>
  )
}

export default MarkDown

export const Pre = styled.pre({
  position: 'relative',
  '&:hover': {
    span: {
      opacity: 1,
    },
  },
})

export const IconContainer = styled.span({
  position: 'absolute',
  top: '1px',
  right: '1px',
  margin: '10px 10px',
  cursor: 'pointer',
  opacity: 0,
})

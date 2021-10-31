import ReactMarkDown from 'react-markdown'
import gfm from 'remark-gfm'
import 'github-markdown-css/github-markdown.css'

export const MarkDown = ({ children }) => {
  return (
    <ReactMarkDown
      className="markdown-body p-3"
      remarkPlugins={[gfm]}
      skipHtml={true}
    >
      {children}
    </ReactMarkDown>
  )
}

export default MarkDown

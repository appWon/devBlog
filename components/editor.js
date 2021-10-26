import { Editor } from '@toast-ui/react-editor'
import '@toast-ui/editor/dist/toastui-editor.css'

const Test = props => {
  return <Editor {...props} ref={props.forwardedRef} />
}

export default Test

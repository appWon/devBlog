import { Viewer } from '@toast-ui/react-editor'
import '@toast-ui/editor/dist/toastui-editor-viewer.css'

const ToastViewer = ({ markDown }) => {
  return <Viewer initialValue={markDown} />
}

export default ToastViewer

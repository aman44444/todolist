import Autocomplete from "../Autocomplete/Autocomplete";
import TasksContainer from "../TasksContainer/TaskContainer";
import '../../Styles/Layout/Layout.css'

const Layout = () => {
    return(
        <div className="layout">
              <Autocomplete/>
              <TasksContainer/>
        </div>

    )
}

export default Layout;
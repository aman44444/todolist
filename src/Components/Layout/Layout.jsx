import { useEffect } from "react";
import Autocomplete from "../Autocomplete/Autocomplete";
import TasksContainer from "../TasksContainer/TaskContainer";
import "../../styles/Layout/Layout.css";
import AlarmPlayer from "../AlarmPlayer/AlarmPlayer";
import useTodosStore from "../../store/store";
import { AlarmEngine } from "../../services/alarmEngine";

const engine = new AlarmEngine();

const Layout = () => {
  const { tasks, triggerAlarm } = useTodosStore();

  useEffect(() => {
    engine.start(tasks, triggerAlarm);

    return () => engine.stop();
  }, [tasks, triggerAlarm]);
  return (
    <div className="layout">
      <Autocomplete />
      <AlarmPlayer />
      <TasksContainer />
    </div>
  );
};

export default Layout;

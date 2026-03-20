import { useState } from "react";
import "../Styles/Navbar.css";
import Modal from "../Components/Modal/Modal";
import useTodosStore from "../store/store";
import { Modes } from "../data/data";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mode, setMode } = useTodosStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const isStrict = mode === "strict";

  const toggleMode = () => {
    setMode(isStrict ? "normal" : "strict");
  };

  return (
    <>
      <nav className="navbarContainer">
        <div className={`heading ${isExpanded ? 'expanded' : ''}`}>
            <h2>TODOIST</h2>
          <div>
            <span className="arrow"></span>
          </div>
          <div className="mode-container">
            <button className="button" onClick={() => setIsModalOpen(true)}>
              Mode
            </button>
          </div>
        </div>
      </nav>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Mode"
        showSwitch
        switchValue={isStrict}
        onSwitchChange={toggleMode}
      >
        <h3>{Modes[mode].label}</h3>

        <ul>
          {Modes[mode].rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </Modal>
    </>
  );
};

export default Navbar;

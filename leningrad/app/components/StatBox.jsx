const StatBox = (props) => {
    return (
      <div className="stat-box">
        <h3>{props.label.number}</h3>
        <p>{props.label.text}</p>
      </div>
    );
  };
  
  export default StatBox;
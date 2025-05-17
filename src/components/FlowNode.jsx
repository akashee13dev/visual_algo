import React from 'react'
import "../css/main.css"
const FlowNode = (props) => {

  const { row , col , visited, isStart, isEnd, onClick , wall , distance , previousNode , isPath } = props;


  let classname = "node"
  if(visited){
    classname += ' visited';
  }
  if(isPath){
    classname += ' isPath';
  }
  if(isStart){
    classname += ' start';
  }
  if(isEnd){
    classname += ' end';
  }

  return (
    <div className={classname} onClick={onClick}>
      
    </div>
  )
}

export default FlowNode

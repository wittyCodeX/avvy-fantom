

//
// loading spinner..
//

function Spinner(props) {
  const style = {}
  if (props.color) style.borderColor = `${props.color} transparent transparent transparent`
  return (
		<div className={`lds-ring ${props.size ? `lds-ring-${props.size}` : ''} ${props.dark ? 'lds-ring-dark' : ''}`}><div style={style}></div><div style={style}></div><div style={style}></div><div style={style}></div></div>
  )
}

export default Spinner

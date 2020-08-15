import colors from 'colors';

export default (type, logTitle, logDetail) => {

  let logColor;

  switch(type) {
	case 'danger':
	  logColor = 'brightRed';
	  break;
	case 'warning':
	  logColor = 'brightYellow';
	  break;
	case 'success':
	  logColor = 'brightGreen';
	  break;
	case 'info':
	  logColor = 'brightBlue';
	  break;
	default:
	  logColor = 'brightWhite';
  }

  if (logTitle && logDetail) {
	console.log(colors[logColor]("\n****************"));
	console.log(colors[logColor](logTitle), colors.brightWhite(logDetail));
	console.log(colors[logColor]("****************\n"));
  } else {
	console.log(colors[logColor]("\n****************"));
	console.log(colors.brightWhite(logTitle));
	console.log(colors[logColor]("****************\n"));
  }
};

import React, {memo} from 'react';
import './LegalStuff.scss'

const LegalStuff = () => (
		<div className="LegalStuff">
			<h5><b>Credits:</b></h5>

		  <div className="credit-item">Plant profile placeholder images: <a href="https://www.freepik.com/free-photos-vectors/flower">Flower vector created by pch.vector - www.freepik.com</a></div>

		  <div className="credit-item">Icons made by <a href="https://www.flaticon.com/authors/nikita-golubev" title="Nikita Golubev">Nikita Golubev</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

		  <div className="credit-item">Icons made by <a href="https://www.flaticon.com/authors/iconixar" title="iconixar">iconixar</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

		  <div className="credit-item">Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

		  <div className="credit-item">Dancing Groot by <a href="https://dribbble.com/shots/1777402-I-Am-Groot?1414061591" title="dribbble">Sunako</a></div>

			<br/>

		  <h5><b>Data Collection:</b></h5>
		  <div className="credit-item">I don't collect your data. Your plant information is stored on a secure cloud database. All passwords are encrypted. The only data collected is the data entered and it is only for your use, I do not sell or use the information in any way.</div>
		</div>
);


export default memo(LegalStuff);

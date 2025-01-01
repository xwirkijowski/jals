import React from 'react';
import formStyles from './Form.module.scss';
import inputGroupStyles from './InputGroup.module.scss';
import inputStyles from './Input.module.scss';

export const Input = ({type, placeholder, required, value, onChange}) => {
	const typeClass = (type) ? inputGroupStyles['input-'+type] : '';

	return (
		<input required={required} type={type} className={`${inputStyles.input} ${inputStyles[typeClass]}`} placeholder={placeholder} value={value} onChange={onChange} />
	)
};

export const InputGroup = ({children}) => {
	return (
		<div className={inputGroupStyles['input-group']}>
			{children}
		</div>
	)
};

export const Form = ({children, onSubmit}) => {
	return (
		<form className={formStyles.form} onSubmit={onSubmit}>
			{children}
		</form>
	)
};
import cx from 'classnames';
import React from 'react';

import {TButtonProps} from "@comp/Button/Button.types";
import {typeStyles} from "@comp/Button/Button.styles";

export default ({
    btnType = 'primary',
    effects = false,
    type = 'button',
    className,
    children,
    ...props
}: TButtonProps): React.ReactNode => {
    return (
        <button
            type={type}
            className={cx(
                "trans px-5 py-3 text-base text-nowrap rounded-xl font-bold ",
                {"shadow-xl hover:shadow-md hover:scale-[0.975]": effects},
                typeStyles[btnType],
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
}
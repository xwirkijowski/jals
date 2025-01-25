"use client";

import React, {useContext} from "react";
import {useAnimation} from "motion/react";
import cx from "classnames";

import {ThemeContext} from "@ctx/theme/theme.context";

import {Button} from "@comp/Button/Button";
import {SunIcon} from "@comp/Icon/Sun";
import {MoonIcon} from "@comp/Icon/Moon";

type TProps = {
    version: string | undefined
}

export const Footer = ({version}: TProps): React.ReactNode => {
    const {setTheme} = useContext(ThemeContext);
    const sunControls= useAnimation(),
          moonControls = useAnimation();
    
    return (
        <footer className={cx(
            'flex flex-row w-full mt-8 px-8 py-4 gap-8 items-center',
            'bg-white border-t border-zinc-900/15',
            'dark:bg-gray-900 dark:border-gray-700',
            'c-trans-4',
        )}>
            <div className={cx('flex w-full')}>

                <p className="text-zinc-400 text-sm">
                    Made by Sebastian Wirkijowski. {version && (` Version ${version}.`)}
                </p>

            </div>
            <div className={cx('flex items-end gap-4')}>
                <Button btnType={'light'} onClick={() => setTheme('light')}
                        onMouseEnter={() => sunControls.start('animate')}
                        onMouseLeave={() => sunControls.start('normal')}>
                    <SunIcon controls={sunControls} />
                </Button>
                <Button btnType={'dark'} onClick={() => setTheme('dark')}
                        onMouseEnter={() => moonControls.start('animate')}
                        onMouseLeave={() => moonControls.start('normal')}>
                    <MoonIcon controls={moonControls} />
                </Button>
            </div>
        </footer>
    )
}
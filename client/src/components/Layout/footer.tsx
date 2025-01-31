"use client";

import React, {useContext} from "react";
import {useAnimation} from "motion/react";
import cx from "classnames";
import Link from "next/link";

import {ThemeContext} from "@ctx/theme/theme.context";

import {Button} from "@comp/button";

import {SunIcon, MoonIcon, GithubIcon} from "@comp/Icon";
import {Wxme} from "@comp/wxme/wxme";

type TProps = {
    version: string | undefined
}

export const Footer = ({version}: TProps): React.ReactNode => {
    const {setTheme} = useContext(ThemeContext);
    const sunControls= useAnimation(),
          moonControls = useAnimation(),
          githubControlsBody = useAnimation(),
          githubControlsTail = useAnimation();
    
    return (
        <footer className={cx(
            'flex flex-row w-full mt-8 px-8 py-4 gap-8 items-center',
            'bg-white border-t border-zinc-900/15',
            'dark:bg-gray-900 dark:border-gray-700',
            'c-trans-4',
        )}>
            <div className={cx('flex w-full gap-4 items-center')}>
                <Wxme />
                <p className="text-zinc-400 text-sm">
                    Made by Sebastian Wirkijowski. {version && (` Version ${version}.`)}
                </p>
            </div>
            <div className={cx('flex items-end gap-4')}>
                <Link passHref href={"https://github.com/xwirkijowski/jals"}>
                    <Button btnType={'theme'} role={"link"} aria-label={"GitHub Repository"}
                            onMouseEnter={async () => {
                                githubControlsBody.start('animate');
                                await githubControlsTail.start('draw');
                                githubControlsTail.start('wag');
                            }}
                            onMouseLeave={() => {
                                githubControlsBody.start('normal');
                                githubControlsTail.start('normal');
                            }}>
                        <GithubIcon controlsBody={githubControlsBody} controlsTail={githubControlsTail} />
                    </Button>
                </Link>
                <Button btnType={'light'} role={"link"} aria-label={"Light Theme"} onClick={() => setTheme('light')}
                        onMouseEnter={() => sunControls.start('animate')}
                        onMouseLeave={() => sunControls.start('normal')}>
                    <SunIcon controls={sunControls} />
                </Button>
                <Button btnType={'dark'} role={"link"} aria-label={"Dark Theme"} onClick={() => setTheme('dark')}
                        onMouseEnter={() => moonControls.start('animate')}
                        onMouseLeave={() => moonControls.start('normal')}>
                    <MoonIcon controls={moonControls} />
                </Button>
            </div>
        </footer>
    )
}
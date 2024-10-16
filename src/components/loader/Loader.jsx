import React, { useEffect, useRef, useState } from 'react'

export default function Loader({ runningcheck }) {
    const [running, setRunning] = useState(false);
    const [current, setCurrent] = useState(0);
    const loaderRef = useRef(null);
    const preloaderRef = useRef(null);
    const timeoutRef = useRef(null);
    useEffect(() => {
        let startTimeout;
        if (runningcheck) {
            startTimeout = setTimeout(() => {
                start();
            }, 10);
        } else {
            if (loaderRef.current) {
                loaderRef.current.classList.remove('active');
            }
            stop();
        }

        return () => {
            if (startTimeout) {
                clearTimeout(startTimeout);
            }
        };
    }, [runningcheck]);
    const crates = () => {
        if (!preloaderRef.current) return [];
        return preloaderRef.current.getElementsByClassName('crate');
    };

    const start = () => {
        if (running) return;
        setRunning(true);
        preloaderRef.current.classList.add('running');
        pickCrate();
    };

    const stop = () => {
        clearTimeout(timeoutRef.current);
        preloaderRef.current.classList.remove('running', 'transition');
        preloaderRef.current.classList.remove(`crate-${current}`);
        crates()[current].classList.remove('source');
        crates()[crates().length - 1 - current].classList.remove('destination');
        setRunning(false);
    };

    const pickCrate = () => {
        const allCrates = crates();
        if (!allCrates.length) return;

        preloaderRef.current.classList.remove(`crate-${current}`, 'transition');
        allCrates[current].classList.remove('source');
        allCrates[allCrates.length - 1 - current].classList.remove('destination');

        const newCurrent = Math.floor(Math.random() * allCrates.length);
        setCurrent(newCurrent);

        preloaderRef.current.classList.add(`crate-${newCurrent}`);
        timeoutRef.current = setTimeout(grabCrate, 1500);
    };

    const grabCrate = () => {
        if (!preloaderRef.current) return;
        preloaderRef.current.classList.add('transition');
        const allCrates = crates();
        allCrates[current].classList.add('source');
        allCrates[allCrates.length - 1 - current].classList.add('destination');

        timeoutRef.current = setTimeout(pickCrate, 1500);
    };
    return (
        <div>
            <div className="preloader" id="preloader" ref={preloaderRef}>
                <div className="wrapper">
                    <div className="box-wrapper crate">
                        <div className="box">
                            <div className="face top"></div>
                            <div className="face left"></div>
                            <div className="face right"></div>
                            <div className="face back"></div>
                            <div className="face front"></div>
                            <div className="face bottom"></div>
                            <div className="hook"></div>
                        </div>
                    </div>
                    <div className="box-wrapper crate">
                        <div className="box">
                            <div className="face top"></div>
                            <div className="face left"></div>
                            <div className="face right"></div>
                            <div className="face back"></div>
                            <div className="face front"></div>
                            <div className="face bottom"></div>
                            <div className="hook"></div>
                        </div>
                    </div>
                    <div className="box-wrapper crate">
                        <div className="box">
                            <div className="face top"></div>
                            <div className="face left"></div>
                            <div className="face right"></div>
                            <div className="face back"></div>
                            <div className="face front"></div>
                            <div className="face bottom"></div>
                            <div className="hook"></div>
                        </div>
                    </div>
                    <div className="box-wrapper crate">
                        <div className="box">
                            <div className="face top"></div>
                            <div className="face left"></div>
                            <div className="face right"></div>
                            <div className="face back"></div>
                            <div className="face front"></div>
                            <div className="face bottom"></div>
                            <div className="hook"></div>
                        </div>
                    </div>
                    <div className="crane">
                        <div className="mast">
                            <div className="face left">
                                <div className="support"></div>
                                <div className="support"></div>
                                <div className="support"></div>
                                <div className="support"></div>
                                <div className="support"></div>
                                <div className="support"></div>
                                <div className="support"></div>
                            </div>
                            <div className="face right">
                                <div className="support"></div>
                                <div className="support"></div>
                                <div className="support"></div>
                                <div className="support"></div>
                                <div className="support"></div>
                                <div className="support"></div>
                                <div className="support"></div>
                            </div>
                            <div className="face back">
                                <div className="support"></div>
                                <div className="support"></div>
                                <div className="support"></div>
                                <div className="support"></div>
                                <div className="support"></div>
                                <div className="support"></div>
                                <div className="support"></div>
                            </div>
                            <div className="face front">
                                <div className="support"></div>
                                <div className="support"></div>
                                <div className="support"></div>
                                <div className="support"></div>
                                <div className="support"></div>
                                <div className="support"></div>
                                <div className="support"></div>
                            </div>
                        </div>
                        <div className="cap-wrapper">
                            <div className="cap">
                                <div className="tower">
                                    <div className="face left">
                                        <div className="support left"></div>
                                        <div className="support right"></div>
                                    </div>
                                    <div className="face right">
                                        <div className="support left"></div>
                                        <div className="support right"></div>
                                    </div>
                                    <div className="face back">
                                        <div className="support left"></div>
                                        <div className="support right"></div>
                                    </div>
                                    <div className="face front">
                                        <div className="support left"></div>
                                        <div className="support right"></div>
                                    </div>
                                    <div className="cable front"></div>
                                    <div className="cable mid-front"></div>
                                    <div className="cable mid-back"></div>
                                    <div className="cable back"></div>
                                </div>
                                <div className="arm">
                                    <div className="trolley">
                                        <div className="cables">
                                            <div className="pully">
                                                <div className="hook"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="segment">
                                        <div className="face left">
                                            <div className="supports"></div>
                                        </div>
                                        <div className="face right">
                                            <div className="supports"></div>
                                        </div>
                                    </div>
                                    <div className="segment">
                                        <div className="face left">
                                            <div className="supports"></div>
                                        </div>
                                        <div className="face right">
                                            <div className="supports"></div>
                                        </div>
                                    </div>
                                    <div className="segment">
                                        <div className="face left">
                                            <div className="supports"></div>
                                        </div>
                                        <div className="face right">
                                            <div className="supports"></div>
                                        </div>
                                    </div>
                                    <div className="segment">
                                        <div className="face left">
                                            <div className="supports"></div>
                                        </div>
                                        <div className="face right">
                                            <div className="supports"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="arm back">
                                    <div className="segment">
                                        <div className="face left">
                                            <div className="supports"></div>
                                        </div>
                                        <div className="face right">
                                            <div className="supports"></div>
                                        </div>
                                    </div>
                                    <div className="segment">
                                        <div className="face left">
                                            <div className="supports"></div>
                                        </div>
                                        <div className="face right">
                                            <div className="supports"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="box-wrapper crate">
                        <div className="box">
                            <div className="face top"></div>
                            <div className="face left"></div>
                            <div className="face right"></div>
                            <div className="face back"></div>
                            <div className="face front"></div>
                            <div className="face bottom"></div>
                            <div className="hook"></div>
                        </div>
                    </div>
                    <div className="box-wrapper crate">
                        <div className="box">
                            <div className="face top"></div>
                            <div className="face left"></div>
                            <div className="face right"></div>
                            <div className="face back"></div>
                            <div className="face front"></div>
                            <div className="face bottom"></div>
                            <div className="hook"></div>
                        </div>
                    </div>
                    <div className="box-wrapper crate">
                        <div className="box">
                            <div className="face top"></div>
                            <div className="face left"></div>
                            <div className="face right"></div>
                            <div className="face back"></div>
                            <div className="face front"></div>
                            <div className="face bottom"></div>
                            <div className="hook"></div>
                        </div>
                    </div>
                    <div className="box-wrapper crate">
                        <div className="box">
                            <div className="face top"></div>
                            <div className="face left"></div>
                            <div className="face right"></div>
                            <div className="face back"></div>
                            <div className="face front"></div>
                            <div className="face bottom"></div>
                            <div className="hook"></div>
                        </div>
                    </div>
                    <div className="target">
                        <div className="target-wrapper">
                            <div className="box-wrapper">
                                <div className="box">
                                    <div className="face top"></div>
                                    <div className="face left"></div>
                                    <div className="face right"></div>
                                    <div className="face back"></div>
                                    <div className="face front"></div>
                                    <div className="face bottom"></div>
                                    <div className="hook"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="box-wrapper base">
                        <div className="box">
                            <div className="face top"></div>
                            <div className="face left"></div>
                            <div className="face right"></div>
                            <div className="face back"></div>
                            <div className="face front"></div>
                            <div className="face bottom"></div>
                            <div></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="Overlay" style={{ display: "block" }}></div>
        </div>
    )
}

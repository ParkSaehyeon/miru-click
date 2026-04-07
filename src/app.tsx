import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './app.css';

ReactDOM.createRoot(document.querySelector("#root")!).render(<App />)

function App() {

    const [open, setOpen] = useState<boolean>(false);
    const [myClick, setMyClick] = useState<number>(0);
    const clickAudioRef = useRef<HTMLAudioElement>(null);
    const myClickRef = useRef<HTMLDivElement>(null);
    const comboResetTimer = useRef<NodeJS.Timeout>(null);
    const [combo, setCombo] = useState<number>(1);

    // BGM 시작
    useEffect(() => {
        let bgm = new Audio("bgm.mp3");
        bgm.volume = 0.2;
        bgm.loop = true;

        const playBgm = () => {
            bgm.play().catch(err => console.error("Audio play failed:", err));
        };

        document.addEventListener("click", playBgm, { once: true });

    }, [])

    useEffect(() => {
        const onMouseLeave = () => {
            setOpen(false);
        };

        window.addEventListener("pointerleave", onMouseLeave);

        return () => {
            window.removeEventListener("pointerleave", onMouseLeave);
        };
    }, [])

    useEffect(() => {
        if (!clickAudioRef.current) {
            clickAudioRef.current = new Audio("pop.mp3");
            clickAudioRef.current.volume = 1;
        }
    }, [open, clickAudioRef]);

    function openMiru() {
        setOpen(true);
    }

    function closeMiru() {
        setOpen(false);
        clickAudioRef.current?.play();
        setMyClick(prev => prev + 1);

        // 콤보

        if (comboResetTimer.current) {
            clearTimeout(comboResetTimer.current);
            setCombo(prev => prev + 1);

            let scale = Math.min(50, 1.05 * (combo / 10))

            playMyClickAnime(scale);

            if (combo > 0 && myClick % 50 === 0) {
                createMyClickPop(myClick + "", scale);
            }

        } else {
            playMyClickAnime(1.3);
            setCombo(1);
        }

        comboResetTimer.current = setTimeout(() => {
            comboResetTimer.current = null;
        }, 125);
    }

    const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    function playMyClickAnime(scale: number) {
        if (myClickRef.current) {
            const rand = getRandomInt(-30, 30);

            myClickRef.current.animate([
                { scale: 1, rotate: '0deg' },
                { scale, rotate: `${rand}deg` },
                { scale: 1, rotate: '0deg' },
            ], {
                duration: 0.3 * 1000,
                easing: 'ease',
                fill: 'forwards'
            })
        }
    }

    function createMyClickPop(text: string, scale: number, color: string = "orange", duration: number = 0.5 * 1000) {
        scale = Math.max(1, scale);

        let { fontSize, fontWeight, fontFamily } = window.getComputedStyle(myClickRef.current!);

        let el = document.createElement("div");
        el.textContent = text;
        el.style.position = 'absolute';
        el.style.left = "50%";
        el.style.transform = 'translateX(-50%)';
        el.style.transformOrigin = 'center left';
        el.style.top = "50px"
        el.style.color = color;
        el.style.zIndex = "99";
        el.style.textAlign = 'center';
        el.style.fontFamily = fontFamily;
        el.style.fontWeight = fontWeight ?? "bold";
        el.style.fontSize = fontSize ?? "40px";
        el.className = "my-click-pop";

        el.animate([
            { opacity: 0, scale: scale * 10 },
            { opacity: 1, scale: scale * 2 },
            { opacity: 1, scale: scale * 2 },
            { opacity: 0, scale },
        ], {
            duration,
            easing: 'ease-out',
            fill: 'forwards'
        })

        document.body.appendChild(el);

        let audio = new Audio("my-click-pop.mp3")
        audio.volume = 0.3;
        audio.play();

        setTimeout(() => {
            el.remove();
        }, duration + 10);
    }

    return <>
        <div className='bg-blur' />
        {/* <button onClick={() => createMyClickPop("100", 1)}>테스트</button> */}
        <div className='my-click' ref={myClickRef}>{myClick}</div>

        <div className='miru-holder'>
            <div id='miru' onPointerDown={openMiru} onPointerUp={closeMiru} data-open={open}>
                <img src={open ? "img/miru-2.png" : "img/miru-idle.png"} alt='미루 이미지' />
            </div>
        </div>
    </>
}
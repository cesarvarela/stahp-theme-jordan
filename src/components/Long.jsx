import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components'
import { Grommet, Box, Stack, Meter as MeterBase, Button, Text } from 'grommet'
import jordan from '../images/jordan.gif'

const theme = {
    "global": {
        "colors": {
            "background": {
                "light": "#ffffff",
                "dark": "#000000"
            }
        },
        "font": {
            "family": "-apple-system,\n         BlinkMacSystemFont, \n         \"Segoe UI\", \n         Roboto, \n         Oxygen, \n         Ubuntu, \n         Cantarell, \n         \"Fira Sans\", \n         \"Droid Sans\",  \n         \"Helvetica Neue\", \n         Arial, sans-serif,  \n         \"Apple Color Emoji\", \n         \"Segoe UI Emoji\", \n         \"Segoe UI Symbol\""
        }
    },
    "button": {
        "extend": [
            null
        ]
    }
}

const SmallButton = styled(Button)`
    font-size: 12px;
`

const Meter = styled(MeterBase)`
`

const ScreenElements = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`

const Jordan = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`

const JordanBg = styled.div`
    position: absolute;
    background-image: url(${jordan});
    background-repeat: no-repeat;
    width: 90%;
    background-size: cover;
    background-size: cover;
    border-radius: 100%;
    padding-bottom: 90%;
`

const { stahpblocker } = window

export default function Long() {

    const [total, setTotal] = useState(100)
    const [left, setLeft] = useState(100);

    const update = useCallback(async () => {

        if (!total) {
            const total = await stahpblocker.getLongBreakTargetTime();
            setTotal(total)
        }

        const time = total - await stahpblocker.getLongBreakTime();
        setLeft(time);

    }, [total])

    useEffect(() => {
        
        update()
        
        const interval = setInterval(async () => update() , 1000);

        return () => {
            clearInterval(interval)
        }
    }, [])

    return (
        <Grommet full theme={theme} style={{ position: 'relative' }} themeMode="dark">

            <ScreenElements>
                <Jordan>
                    <JordanBg />
                    <Meter size="large" type="circle" round thickness="medium" value={(left * 100) / total} max={100} />
                </Jordan>
                <Box align="center" justify="center" margin={{ "top": "medium" }} flex="grow">
                    <Button label="Skip this break" plain size="small" onClick={() => stahpblocker.skipBreak()} />
                    <Box align="center" justify="center" margin={{ "top": "xsmall" }}>
                        <SmallButton label="Only close this window" plain size="small" onClick={() => stahpblocker.close()} />
                    </Box>
                </Box>
            </ScreenElements>

        </Grommet>
    )
}
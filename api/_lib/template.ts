
import { readFileSync } from 'fs';
import { marked } from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(`${__dirname}/../_fonts/Inter-Regular.woff2`).toString('base64');
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString('base64');
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString('base64');

function getCss(theme: string, fontSize: string) {
    let background = '#18181B';
    let foreground = 'white';
    let radial = 'lightgray';

    if (theme === 'dark') {
        background = '#18181B';
        foreground = 'white';
        radial = 'lightgray';
    }
    return `
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    body {
        background: ${background};
        // background-image: radial-gradient(circle at 25px 25px, ${radial} 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${radial} 2%, transparent 0%);
        background-size: 100px 100px;
        height: 100vh;
        width: 100vw;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .image-wrapper {
        width: 50vw;
        border-radius: 25px;
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .image {
        width: 100%;
        object-fit: cover;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-family: 'Inter', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        font-weight: bold;
        color: ${foreground};
        line-height: 1.8;
    }

    .mg-logo {
        font-size: 50px;
        font-weight: bold;
        font-style: normal;
        font-family: 'Inter', sans-serif;
        color: ${foreground};
    }
    
    .mg-subtitle {
        font-size: 40px;
        font-weight: bold;
        font-style: normal;
        font-family: 'Inter', sans-serif;
        color: ${foreground};
    }


    .child {
        width: 50vw;
        height: 100vh;
        color: white;
        display: flex;
        flex-direction: column;
        text-align: center;
        align-items: center;
        justify-content: center;
    }
`;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, theme, md, fontSize, images } = parsedReq;
    return `<!DOCTYPE html>
    <html>
      <meta charset="utf-8" />
      <title>Generated Image</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        ${getCss(theme, fontSize)}
      </style>
      <body>
        <div class="child">
          <div>
            <img
              width="60px"
              src="https://llzvxlmtartturuaqvve.supabase.in/storage/v1/object/public/public/logo.png"
            />
            <h1 class="mg-logo">Money Games</h1>
            <span class="mg-subtitle">The web3 arcade for risk-based mini-games</span>
          </div>
          <div class="heading">
            ${emojify( md ? marked(text) : sanitizeHtml(text) )}
          </div>
        </div>
        <div class="child">
            <div class="image-wrapper">
              <img class="image" src="${sanitizeHtml(images[0])}">
            </div>
        </div>
      </body>
    </html>`;
}

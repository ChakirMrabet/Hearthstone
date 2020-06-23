# Hearthstone Browser, v1.0

A small application for browsing Hearthstone cards and building your own decks using the Hearthstone API hosted at [RapidAPI](https://rapidapi.com/). The decks can be exported into `JSON` files, which then can be imported again into the application.

This project is made with React and TypeScript, and it queries the remote API only when the searched cards have not been downloaded before. The application searches first in the local content for the desired data before attempting to query from the remote API.

A live version can be found at http://hearthstone.cmrabet.com .

## Usage

After cloning the repository, make a copy of `.env.example` into a new file `.env`, in which you need to enter your RapidAPI credentials. Once this is done, from within the project folder, run the following command:

`npm install`

### Build

`npm run build`

The folder `dist` will contain the distributable files.

### Develop

`npm start`

## MIT License

HearthStone Browser.
Copyright (c) 2020 Chakir Mrabet <hello@cmrabet.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

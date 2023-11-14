import { withStyles } from "@mui/styles";
import React, { Component, FC } from "react";
import { Route } from "react-router";
import { CreateTable } from "./GridTable";
import { IOrderDetail, UploadStatus } from "./Views/entry";
import { LazyStatus } from "./Views/types";
import { VideoPage } from "./Views/VideoPage";
import { OrderPage, OrderPageBase } from "./Views/OrderPage";
import { Sleep } from "./helper";
import { Container } from "reactstrap";
import Dropzone from 'react-dropzone'
import { DropzoneArea } from "./DropZone";
import * as Sub from './SubComponents'
const styles = () => ({
  "@global": {
    ".container-box": {
      width: "100px",
      height: "100px",
      backgroundColor: "red",
      animationName: "$example",
      animationDuration: "4s",
      ".oooo": {
        backgroundColor: "blue",
      },
    },
    "@keyframes example": {
      from: { backgroundColor: "red" },
      to: { backgroundColor: "yellow" },
    },
  },
});
type kk = ReturnType<typeof styles>;
type jjj<Model> = {
  [key in keyof Extract<Model, unknown>]: string;
};

interface TestStyleProps {
  classes: jjj<kk>;
}
class TestStyle extends Component<TestStyleProps> {
  render() {
    return (
      <div className={"container-box"}>
        <div className="hello-pp">Hello</div>
        <p className="oooo">llll</p>
      </div>
    );
  }
}

const UUU = withStyles(styles)(TestStyle);
const TestTable = CreateTable<{
  Id: string;
  Name: string;
  Option: string;
}>({
  Options: { Name: { flex: 1 }, Option: { flex: 1 } },
  SelectId: (m) => m.Id,
});
class App extends Component {
  render() {
    return (
      <>
        <Route exact path={["/test1", "/"]} component={() => {
          return <Container>
            <VideoPage
              data={{ "323213213": { Id: '323213213', Length: 10000 } as any }}
              Categories={{}}
              CheckStatus={() => Promise.resolve({} as any)}
              EditVideo={() => Promise.resolve({} as any)}
              FetchData={() => Promise.resolve([] as any)}
              Status={LazyStatus.Loaded}
              UpdateVideoRange={() => Promise.resolve({} as any)}
              UploadStatusComponent={UploadStatus}
              DeleteVideo={async () => { await Sleep(10000) }}
              classes={{} as any}
            // ImageAudio=""
            />
          </Container>
        }} />
        <Route path={"/test2"} component={() => (<div>helllll</div>)} />
      </>
    );
  }
}


function loadScript(url: string, callback: () => void) {
  // adding the script element to the head as suggested before
  const head = document.getElementsByTagName('head')[0];
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;

  // then bind the event to the callback function 
  // there are several events for cross browser compatibility
  // script.onreadystatechange = callback;
  script.onload = callback;

  // fire the loading
  head.appendChild(script);
}
export default class App_V6 extends Component {
  public render() {
    return (
      <div>
        <Sub.InputOutlinePassword MaxLength={100} Title='hello' />
      </div>

    );
  }
}

const App_v5: FC<any> = (props) => {
  return <div>useGoogleApi</div>
}
App_v5

class App_Order extends Component {
  render() {
    return (
      <Container style={{ display: 'flex', height: "600px" }}>
        <OrderPageBase
          data={{ "323213213": { Id: '323213213', Length: 10000 } as any }}
          FetchData={() => Promise.resolve([] as any)}
          Status={LazyStatus.Loaded}
          DownloadMedia={() => Promise.resolve()}
          fetchUserOrderDetail={() => Promise.resolve<IOrderDetail[]>([
            {
              "Id": "f503663e-e35d-40c8-9933-21542fc23fbc",
              "OrderName": null,
              "MediaName": "917ae2bd-7c91-4d05-9e1e-40378a389830",
              "OptionName": "bca6",
              "Price": 200,
              "OrderId": "36632140-a179-436b-b0d1-95d94528141f",
              "MediaId": "47a1b899-e741-4b2a-9435-fe0fd07d3e0e",
              "OptionId": "0ad745d1-a2c5-47d6-bca6-38fe882aa6ec",
              "Type": "Video",
              "ChannelUrl": "https://www.youtube.com/watch?v=LektczEk6do\nhttps://www.youtube.com/watch?v=LektczEk6do\nhttps://www.youtube.com/watch?v=LektczEk6do"
            },
            {
              "Id": "b383a737-41cf-401a-bc53-99e8d4aabcda",
              "OrderName": null,
              "MediaName": "09fbf63c-38bb-476b-ab80-ce55eb005911",
              "OptionName": "bca6",
              "Price": 200,
              "OrderId": "984ad232-f195-4cb7-a465-38caa8cfe7c3",
              "MediaId": "645ecf57-a31e-4806-9a9c-8ab00951fe8b",
              "OptionId": "0ad745d1-a2c5-47d6-bca6-38fe882aa6ec",
              "Type": "Video",
              "ChannelUrl": "https://www.youtube.com/watch?v=LektczEk6do\nhttps://www.youtube.com/watch?v=LektczEk6do\nhttps://www.youtube.com/watch?v=LektczEk6do"
            },
            {
              "Id": "04732af5-09e4-47b0-816d-ba42a380f352",
              "OrderName": null,
              "MediaName": "917ae2bd-7c91-4d05-9e1e-40378a389830",
              "OptionName": "p3",
              "Price": 300,
              "OrderId": "984ad232-f195-4cb7-a465-38caa8cfe7c3",
              "MediaId": "47a1b899-e741-4b2a-9435-fe0fd07d3e0e",
              "OptionId": "015055ec-b751-482a-b890-7b213941944b",
              "Type": "Video",
              "ChannelUrl": "https://www.youtube.com/watch?v=LektczEk6do\nhttps://www.youtube.com/watch?v=LektczEk6do\nhttps://www.youtube.com/watch?v=LektczEk6do"
            },
            {
              "Id": "81776f18-e0e1-484d-9313-fc41ad04a6f3",
              "OrderName": null,
              "MediaName": "727a04a0-73b4-4498-98c1-3fce7c3b93b8",
              "OptionName": "bca6",
              "Price": 200,
              "OrderId": "36632140-a179-436b-b0d1-95d94528141f",
              "MediaId": "fd88a925-e58c-4d56-8bbf-940970b8ab5e",
              "OptionId": "0ad745d1-a2c5-47d6-bca6-38fe882aa6ec",
              "Type": "Video",
              "ChannelUrl": "https://www.youtube.com/watch?v=LektczEk6do\nhttps://www.youtube.com/watch?v=LektczEk6do\nhttps://www.youtube.com/watch?v=LektczEk6do"
            }
          ] as any)}
        // ImageAudio=""
        />
      </Container>
    );
  }
}
class App_v2 extends Component {
  render() {
    return (
      <>
        <TestTable data={[]} InnerProps={{
          checkboxSelection: true
        }} />
      </>
    );
  }
}

class App_v3 extends Component {
  render() {
    return (
      <>
        <DropzoneArea
          dropzoneText="Drag and drop files here or click"
          showPreviewsInDropzone={false}
          useChipsForPreview={false}
          maxFileSize={2147483648}
          filesLimit={1000}
          showAlerts={["error"]}
          showPreviews={false}
        // onDrop={this.handleChange.bind(this)}
        // acceptedFiles={TypeFilters[this.state.Type]}
        />
      </>
    );
  }
}


// export default class App_v4 extends Component {
//   render() {
//     return (
//       <>
//         <Dropzone maxFiles={1000} maxSize={2147483648} onDrop={acceptedFiles => console.log(acceptedFiles)}>
//           {({ getRootProps, getInputProps }) => (
//             <section>
//               <div {...getRootProps()}>
//                 <input {...getInputProps()} />
//                 <p>Drag n drop some files here, or click to select files</p>
//               </div>
//             </section>
//           )}
//         </Dropzone>
//       </>
//     );
//   }
// }
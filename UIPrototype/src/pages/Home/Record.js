import React from 'react';
import '../../css/Record.css';
import HeaderBar from "../../components/HeaderBar";
import ChatMessage from "../../components/Record/ChatMessage";
import {Button, Dialog, SearchBar} from "antd-mobile";
import moment from "moment/moment";
import Stopwatch from "../../utils/Stopwatch";
import {AddCircleOutline, ClockCircleOutline, PicturesOutline, SmileOutline} from "antd-mobile-icons";
import PChecklist from "../../components/Record/PopupChecklist";
import {saveMsg} from "../../service/loginService";
import RecordUtils from "../../components/Record/RecordUtils";

class Record extends React.Component {
    state = {
        messages: [
            {
                myType: false, msgType: "msg",
                message: '快给我玩原神。', key: 2
            },
        ],
        isStart: 0, //0 new, 1 start, 2 end
        isExtd: false,
    }

    addMsg = (e, myType, msgType) => {
        const tmp = [...this.state.messages];
        tmp.push({
            myType: myType,
            msgType: msgType,
            message: e,
            key: tmp.length + 1
        })
        this.setState({
            messages: [...tmp]
        })
    }

    onClickBack = () => {
        if (this.state.isStart === 1) {
            Dialog.show({
                style: {
                    textAlign: 'center'
                },
                content: '还在记录中，退出将不会保存，继续吗？',
                closeOnAction: true,
                actions: [[
                    {key: 'cancel', text: '取消'},
                    {key: 'confirm', text: '确认', bold: true, danger: true,},
                ]],
                onAction: (e) => {
                    if (e.key === 'confirm')
                        this.props.history.goBack();
                }
            })
        } else if (this.state.isStart === 2)
            this.saveQuit(false);
        else
            this.props.history.goBack();
    }

    onClickBtn = () => {
        if (!this.state.isStart) {
            this.bottom.classList.add("bottom_up");
            this.bottom.classList.remove("bottom_down");
            this.header.classList.add("white2green");
            this.addMsg("开始记录。现在是" +
                moment(new Date().getTime()).format('HH:mm:ss').toString() +
                "，专心致志才能有所收获哦！", false, "msg");
        } else if (this.state.isStart === 1) {
            if (!this.state.isExtd) {
                this.bottom.classList.remove("bottom_up");
                this.bottom.classList.remove("bottom_edown");
                this.bottom.classList.add("bottom_down");
            } else {
                this.bottom.classList.remove("bottom_extd");
                this.bottom.classList.add("bottom_bigdown");
            }
            this.header.classList.add("green2orange");
            this.addMsg("结束记录。现在是" +
                moment(new Date().getTime()).format('HH:mm:ss').toString() +
                "，将美好的事物记录下来，然后去放松一下吧。", false, "msg");
        } else {
            this.saveQuit(true, 1);
        }
        this.setState({isStart: this.state.isStart + 1})
    }

    onClickExtd = () => {
        if (!this.state.isExtd) {
            this.bottom.classList.remove("bottom_up");
            this.bottom.classList.remove("bottom_edown");
            this.bottom.classList.add("bottom_extd");
        } else {
            this.bottom.classList.remove("bottom_extd");
            this.bottom.classList.add("bottom_edown");
        }
        this.setState({isExtd: !this.state.isExtd});
    }

    saveQuit = (type, idx) => {
        const callback = () => {
            if (type)
                this.props.history.push('/stats/details', {id: idx});
            else
                this.props.history.goBack();
        }

        Dialog.show({
            style: {
                textAlign: 'center'
            },
            content: '保存记录并退出？',
            closeOnAction: true,
            actions: [[
                {key: 'cancel', text: '继续编辑'},
                {key: 'confirm', text: '确认', bold: true, danger: true},
            ]],
            onAction: (e) => {
                if (e.key === 'confirm') {
                    this.state.messages.map((msg, idx) => {
                        if (msg.myType) {
                            const tmp = {
                                timestamp: "2023/2/29/",
                                datatype: "message",
                                message: msg.message,
                                location: "testFlight",
                                user: "1"
                            };
                            saveMsg(tmp, callback, () => {
                                this.setState({isStart: 2});
                            });
                        }
                    })
                }
            }
        })
    }

    clearInput = () => {
        this.inputMsg.clear();
        this.inputMsg.focus();
    }

    render() {
        const msgFieldMBottom = this.state.isStart === 1 ?
            (this.state.isExtd ? 240 : 160) : 90;

        return (
            <div id="record_body">
                <div id="record_absoluteField"
                     ref={e => this.header = e}>
                    <HeaderBar title="记录"
                               backFunc={this.onClickBack}/>
                </div>

                <div id="record_msgField"
                     style={{overflow: 'scroll', paddingTop: 24, marginBottom: msgFieldMBottom}}>
                    <div>
                        {this.state.messages.map((msg, index) => (
                            <ChatMessage key={index} msg={msg}/>
                        ))}
                    </div>
                </div>


                <div id="record_bottom"
                     ref={e => this.bottom = e}>
                    <div id="record_btn">
                        <Button color={"primary"}
                                style={{fontSize: 25, width: 100}}
                                onClick={this.onClickBtn}>
                            {!this.state.isStart ? "Start" :
                                this.state.isStart === 1 ? "Stop" : "Save"}</Button>
                    </div>
                    <div id="record_searchBar"
                         style={{position: 'relative'}}>
                        <SearchBar icon={null} placeholder='请输入内容'
                                   ref={e => this.inputMsg = e}
                                   style={{
                                       width: 260, marginBottom: 30,
                                       '--height': '40px'
                                   }}
                                   onSearch={(e) => {
                                       if (e === "") return;
                                       this.addMsg(e, true, "msg");
                                       this.clearInput();
                                   }}/>
                        <div id="record_extd"
                             style={{
                                 position: 'absolute', right: '-50px', top: '5px'
                             }}
                             onClick={this.onClickExtd}>
                            <AddCircleOutline fontSize={30}/>
                        </div>
                    </div>
                    <RecordUtils flag={this.state.isStart === 1}
                                 addMsg={this.addMsg.bind(this)}/>
                </div>
            </div>
        );
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const e = document.getElementById("record_msgField");
        e.scrollTo({
            top: e.scrollHeight - 10,
            behavior: 'smooth'
        })
        e.scrollTo({
            top: e.scrollHeight - 10,
            behavior: 'smooth'
        })
    }
}

export default Record;
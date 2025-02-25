package com.Controller;

import com.Constant.MessageConstant;
import com.Entity.Message;
import com.Service.EventService;
import com.Service.MessageService;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.criteria.CriteriaBuilder;
import java.util.List;
import java.util.Map;


@RequestMapping("/message")
@RestController
public class MessageController {

    @Autowired
    MessageService messageService;

    @Autowired
    EventService eventService;
    @RequestMapping("/add")
    public JSONObject AddMessage(@RequestBody Map<String, String> params) {
        String timestamp = params.get(MessageConstant.TIMESTAMP);
        String datatype = params.get(MessageConstant.DATATYPE);
        String message = params.get(MessageConstant.MESSAGE);
        String event = params.get(MessageConstant.EVENT);
        Message mes = new Message();
        mes.setTimestamp(timestamp);
        mes.setDatatype(datatype);
        mes.setMessage(message);
        mes.setEvent(eventService.GetEvent(Integer.valueOf(event)));
        messageService.AddMessage(mes);
        return (JSONObject) JSON.toJSON(mes);
    }

    @RequestMapping("/get")
    public JSONArray GetMessages(@RequestBody Map<String, String> params)
    {
        String user =  params.get(MessageConstant.USER);
        String event = params.get(MessageConstant.EVENT);
        List<Message> mes = messageService.GetMessages(Integer.valueOf(event));
        return JSONArray.parseArray(JSON.toJSONString(mes));
    }

    @RequestMapping("/update")
    public JSONObject UpdateMessage(@RequestBody Map<String, String> params)
    {
        String id = params.get(MessageConstant.MESSAGEID);
        String mes = params.get(MessageConstant.MESSAGE);
        messageService.UpdateMessage(mes, Integer.valueOf(id));
        return (JSONObject) JSON.toJSON(messageService.GetMessage(Integer.valueOf(id)));
    }

    @RequestMapping("/delete")
    public JSONObject DeleteMessage(@RequestBody Map<String, String> params)
    {
        String id = params.get(MessageConstant.MESSAGEID);
        if (messageService.GetMessage(Integer.valueOf(id)) == null)
        {
            JSONObject obj = new JSONObject();
            obj.put("message", "fail");
            return obj;
        }
        messageService.DeleteMessage(Integer.valueOf(id));
        JSONObject obj = new JSONObject();
        obj.put("message", "success");
        return obj;
    }
}
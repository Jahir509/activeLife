using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace Application.SignalR
{
    public class ChatHub : Hub
    {
        public ChatHub(IMediator mediator)
        {
        }
    }
}
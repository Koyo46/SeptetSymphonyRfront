// hooks/usePusher.ts
import { useEffect, useState } from 'react';
import Pusher, { Channel } from 'pusher-js';

const usePusher = (channelName: string) => {
    const [channel, setChannel] = useState<Channel | null>(null);

    useEffect(() => {
        const pusher = new Pusher('ac844227d7600700a1bb', {
            cluster: 'ap3'
        });
        const subscribedChannel = pusher.subscribe(channelName);

        setChannel(subscribedChannel);

        return () => {
            subscribedChannel.unbind_all();
            subscribedChannel.unsubscribe();
            pusher.disconnect();
        };
    }, [channelName]);

    return channel;
};

export default usePusher;
import queue from "../../config/queue";
import BirthdayQueue from "./BirthdayQueue";

class MainQueue {
    main() {
        BirthdayQueue.main(queue)
    }
}

export default new MainQueue()

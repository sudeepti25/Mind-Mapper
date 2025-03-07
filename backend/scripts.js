"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEventStatus = exports.deleteTask = exports.updateStatus = exports.getTasks = exports.addTask = exports.getCategory = exports.addCategory = exports.deleteEvent = exports.getFlashcards = exports.addCard = exports.getSubjects = exports.addSubject = exports.deleteNote = exports.getNotes = exports.saveNotes = exports.getEvents = exports.createEvent = exports.insert_user = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const insert_user = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data) {
        console.log("DATA IS NOT PROVIDED");
        return; // return if data is not provided. This helps in preventing unnecessary database operations.
    }
    try {
        const existinguser = yield prisma.user.findUnique({
            where: {
                email: String(data.email)
            },
        });
        if (existinguser) {
            return;
        }
        yield prisma.user.create({
            data: {
                name: data.displayName,
                email: data.email,
                profile_pic: data.photoURL
            }
        });
    }
    catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.insert_user = insert_user;
const createEvent = (tasks, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findExis = yield prisma.events.findUnique({
            where: {
                title: tasks.content
            }
        });
        if (findExis) {
            return { success: false, message: 'Task already exists' };
        }
        const userData = yield prisma.user.findUnique({
            where: {
                email: userEmail
            }
        });
        if (!userData)
            return { success: false, message: 'USER NOT FOUND' };
        yield prisma.events.create({
            data: {
                title: tasks.content,
                priority: tasks.priority,
                start_date: tasks.startDate,
                end_date: tasks.endDate,
                status: tasks.completed,
                description: tasks.description,
                userId: userData.id
            }
        });
        return { success: true, message: 'Task created successfully' };
    }
    catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.createEvent = createEvent;
const getEvents = (email, includeNotes) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = yield prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!userData) {
            return { success: false, message: 'User not found' };
        }
        const events = yield prisma.events.findMany({
            where: {
                userId: userData.id,
            },
            include: includeNotes ? { notes: true } : undefined
        });
        return events;
    }
    catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.getEvents = getEvents;
const saveNotes = (title, notes, emailId, eventid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = yield prisma.user.findUnique({
            where: {
                email: emailId
            }
        });
        if (!userData) {
            return { success: false, message: 'USER NOT FOUND' };
        }
        yield prisma.notes.create({
            data: {
                title: title,
                content: notes,
                userId: userData.id,
                eventId: eventid !== 0 ? eventid : null,
            }
        });
        return { success: true, message: "NOTE SAVED SUCCESSFULLY" };
    }
    catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.saveNotes = saveNotes;
const getNotes = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!user) {
            return { success: false, message: 'USER NOT FOUND' };
        }
        const notes = yield prisma.notes.findMany({
            where: {
                userId: user.id
            }
        });
        if (!notes) {
            return { success: false, message: 'NO NOTES FOUND' };
        }
        return { success: true, notes };
    }
    catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.getNotes = getNotes;
const deleteNote = (email, noteId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userdata = yield prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!userdata) {
            return { success: false };
        }
        yield prisma.notes.delete({
            where: {
                id: noteId,
                userId: userdata.id
            }
        });
        return { success: true };
    }
    catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.deleteNote = deleteNote;
const addSubject = (email, subjectName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userdata = yield prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!userdata) {
            return { success: false };
        }
        const existingSubject = yield prisma.subjects.findFirst({
            where: {
                name: subjectName,
                userid: userdata.id
            }
        });
        if (existingSubject) {
            return { success: false, message: "Subject already exists" };
        }
        const subject = yield prisma.subjects.create({
            data: {
                name: subjectName,
                userid: userdata.id
            }
        });
        return { success: true, subject: subject };
    }
    catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.addSubject = addSubject;
const getSubjects = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userdata = yield prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!userdata) {
            return { success: false, message: 'User not found' };
        }
        const subjects = yield prisma.subjects.findMany({
            where: {
                userid: userdata.id
            }
        });
        return { success: true, subject: subjects };
    }
    catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.getSubjects = getSubjects;
const addCard = (email, question, answer, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userdata = yield prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!userdata) {
            return { success: false, message: 'User not found' };
        }
        const card = yield prisma.flashcards.create({
            data: {
                question: question,
                answer: answer,
                subjectId: Number(id),
                userid: userdata.id
            }
        });
        if (!card) {
            return { success: false, message: 'Error creating card' };
        }
        return { success: true, card: card };
    }
    catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.addCard = addCard;
const getFlashcards = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userdata = yield prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!userdata) {
            return { success: false, message: 'User not found' };
        }
        const flashcards = yield prisma.flashcards.findMany({
            where: {
                userid: userdata.id
            }
        });
        return { success: true, flashcards: flashcards };
    }
    catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.getFlashcards = getFlashcards;
const deleteEvent = (emailId, eventId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userdata = yield prisma.user.findUnique({
            where: {
                email: emailId
            }
        });
        if (!userdata) {
            return { success: false, message: 'User not found' };
        }
        yield prisma.events.delete({
            where: {
                id: Number(eventId),
                userId: userdata.id
            }
        });
        return { success: true, message: 'Event deleted successfully' };
    }
    catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.deleteEvent = deleteEvent;
const addCategory = (name, emailId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userdata = yield prisma.user.findUnique({
            where: {
                email: emailId
            }
        });
        if (!userdata) {
            return { success: false, message: 'User not found' };
        }
        yield prisma.category.create({
            data: {
                name: name,
                userId: userdata.id
            }
        });
        return { success: true, message: 'Category added successfully' };
    }
    catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.addCategory = addCategory;
const getCategory = (emailId) => __awaiter(void 0, void 0, void 0, function* () {
    const userdata = yield prisma.user.findUnique({
        where: {
            email: emailId
        }
    });
    if (!userdata) {
        return { success: false, message: 'User not found' };
    }
    const categories = yield prisma.category.findMany({
        where: {
            userId: userdata.id
        }
    });
    if (!categories) {
        return { success: false, message: 'No categories found' };
    }
    return categories;
});
exports.getCategory = getCategory;
const addTask = (name, startDate, endDate, category, emailId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userdata = yield prisma.user.findUnique({
            where: {
                email: emailId
            }
        });
        const categoryId = yield prisma.category.findUnique({
            where: {
                name: category
            }
        });
        if (!userdata) {
            return { success: false, message: 'User not found' };
        }
        if (!categoryId) {
            return { success: false, message: 'Category not found' };
        }
        yield prisma.tasks.create({
            data: {
                title: name,
                start_date: startDate,
                end_date: endDate,
                categoryId: categoryId.id,
                userID: userdata.id
            }
        });
        return { success: true, message: 'Task added successfully' };
    }
    catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.addTask = addTask;
const getTasks = (emailId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userdata = yield prisma.user.findUnique({
            where: {
                email: emailId
            }
        });
        if (!userdata) {
            return { success: false, message: 'User not found' };
        }
        const tasks = yield prisma.tasks.findMany({
            where: {
                userID: userdata.id
            }
        });
        if (!tasks) {
            return { success: false, message: 'No tasks found' };
        }
        return tasks;
    }
    catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.getTasks = getTasks;
const updateStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield prisma.tasks.findUnique({
            where: {
                id: Number(id)
            }
        });
        if (!task) {
            return { success: false, message: 'Task not found' };
        }
        const updated = yield prisma.tasks.update({
            where: {
                id: Number(id)
            },
            data: {
                status: !status
            }
        });
        return { success: true, message: 'Task status updated successfully', updated };
    }
    catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.updateStatus = updateStatus;
const deleteTask = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.tasks.delete({
            where: {
                id: Number(id)
            }
        });
        return { success: true, message: 'Taskk deleted successfully' };
    }
    catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.deleteTask = deleteTask;
const updateEventStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.events.update({
            where: {
                id: Number(id)
            },
            data: {
                status: !status
            }
        });
    }
    catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.updateEventStatus = updateEventStatus;

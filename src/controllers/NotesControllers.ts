import { NextFunction, Request, RequestHandler, Response } from "express"
import NoteModel from "../models/note"
import createHttpError from "http-errors"
import mongoose from "mongoose"

export const getNotes: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const notes = await NoteModel.find({ userId: req.user._id }).exec()
    res.status(200).json(notes)
  } catch (error) {
    next(error)
  }
}

export const getNote: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const noteId = req.params.noteId
  try {
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid Note id")
    }
    const note = await NoteModel.findById(noteId).exec()
    if (!note) {
      throw createHttpError(404, "Note not found")
    }

    if (note.userId.toString() === req.user._id) {
      throw createHttpError(401, "You cannot access this note!")
    }
    res.status(200).json(note)
  } catch (error) {
    next(error)
  }
}

export const createNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const title = req.body.title
  const text = req.body.text
  try {
    if (!title) {
      throw createHttpError(400, "Note must have a title!")
    }

    const newNote = await NoteModel.create({
      userId: req.user._id,
      title,
      text,
    })
    res.status(201).json(newNote)
  } catch (error) {
    next(error)
  }
}

export const updateNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const noteId = req.params.noteId
  const newTitle = req.body.title
  const newText = req.body.text
  try {
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid Note id")
    }

    if (!newTitle) {
      throw createHttpError(400, "Note must have a title!")
    }

    const note = await NoteModel.findById(noteId).exec()

    if (!note) {
      throw createHttpError(404, "Note not found")
    }

    if (note.userId.toString() === req.user._id) {
      throw createHttpError(401, "You cannot access this note!")
    }

    note.title = newTitle
    note.text = newText

    const updatedNote = await note.save()

    res.status(200).json(updatedNote)
  } catch (error) {
    next(error)
  }
}

export const deleteNote: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const noteId = req.params.noteId
  try {
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid Note id")
    }

    const note = await NoteModel.findById(noteId).exec()

    if (!note) {
      throw createHttpError(404, "Note not found")
    }

    if (note.userId.toString() === req.user._id) {
      throw createHttpError(401, "You cannot access this note!")
    }

    await note.deleteOne({ _id: noteId })

    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

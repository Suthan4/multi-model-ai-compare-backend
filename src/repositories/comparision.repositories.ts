import { Comparison, IComparison } from "../models/comparisions.model";
import { ComparisonStatus } from "../constants/models";

export class ComparisonRepository {
  async create(data: Partial<IComparison>): Promise<IComparison> {
    const comparison = new Comparison(data);
    return await comparison.save();
  }

  async findById(id: string): Promise<IComparison | null> {
    return await Comparison.findById(id);
  }

  async findAll(): Promise<IComparison[] | null> {
    return await Comparison.find().sort({ createdAt: -1 });
  }

  async findByShareId(shareId: string): Promise<IComparison | null> {
    return await Comparison.findOne({ shareId, isPublic: true });
  }

  async findRecent(
    limit: number = 10,
    userId?: string
  ): Promise<IComparison[]> {
    const query = userId ? { createdBy: userId } : { isPublic: true };
    return await Comparison.find(query).sort({ createdAt: -1 }).limit(limit);
  }

  async update(
    id: string,
    data: Partial<IComparison>
  ): Promise<IComparison | null> {
    return await Comparison.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
  }

  async updateStatus(
    id: string,
    status: ComparisonStatus
  ): Promise<IComparison | null> {
    return await Comparison.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );
  }

  async delete(id: string): Promise<boolean> {
    const result = await Comparison.findByIdAndDelete(id);
    return !!result;
  }

  async getStats(userId?: string): Promise<any> {
    const query = userId ? { createdBy: userId } : {};

    const stats = await Comparison.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalComparisons: { $sum: 1 },
          avgResponseTime: { $avg: "$totalResponseTime" },
          completedComparisons: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          failedComparisons: {
            $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
          },
        },
      },
    ]);

    return (
      stats[0] || {
        totalComparisons: 0,
        avgResponseTime: 0,
        completedComparisons: 0,
        failedComparisons: 0,
      }
    );
  }
}

export const comparisonRepository = new ComparisonRepository();

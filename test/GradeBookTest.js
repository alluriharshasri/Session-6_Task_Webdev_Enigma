const GradeBook = artifacts.require("GradeBook");

contract("GradeBook", accounts => {
    const [owner, other] = accounts;
    let gradeBook;

    before(async () => {
        gradeBook = await GradeBook.deployed();
    });

    it("should allow the owner to add a grade", async () => {
        await gradeBook.addGrade("Alice", "Math", 95, { from: owner });
        const grade = await gradeBook.getGrade("Alice", "Math");
        assert.equal(grade.toNumber(), 95, "The grade should be 95");
    });

    it("should not allow others to add a grade", async () => {
        try {
            await gradeBook.addGrade("Bob", "Math", 85, { from: other });
            assert.fail("Only the owner should be able to add grades");
        } catch (error) {
            assert(error.message.includes("Only owner can call this function"), "Expected only owner restriction");
        }
    });

    it("should allow the owner to update a grade", async () => {
        await gradeBook.addGrade("Alice", "Math", 95, { from: owner });
        await gradeBook.updateGrade("Alice", "Math", 90, { from: owner });
        const updatedGrade = await gradeBook.getGrade("Alice", "Math");
        assert.equal(updatedGrade.toNumber(), 90, "The grade should be updated to 90");
    });

    it("should not allow others to update a grade", async () => {
        try {
            await gradeBook.updateGrade("Alice", "Math", 85, { from: other });
            assert.fail("Only the owner should be able to update grades");
        } catch (error) {
            assert(error.message.includes("Only owner can call this function"), "Expected only owner restriction");
        }
    });

    it("should calculate average grade correctly", async () => {
        await gradeBook.addGrade("Alice", "Math", 95, { from: owner });
        await gradeBook.addGrade("Bob", "Math", 85, { from: owner });
        await gradeBook.addGrade("Alice", "Science", 90, { from: owner });

        const averageMathGrade = await gradeBook.averageGrade("Math");
        const averageScienceGrade = await gradeBook.averageGrade("Science");

        assert.equal(averageMathGrade.toNumber(), 90, "Average Math grade should be 90");
        assert.equal(averageScienceGrade.toNumber(), 90, "Average Science grade should be 90");
    });
});
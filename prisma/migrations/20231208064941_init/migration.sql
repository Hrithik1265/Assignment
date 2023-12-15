-- CreateTable
CREATE TABLE "Users" (
    "id" VARCHAR(40) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "is_hod" BOOLEAN NOT NULL,
    "is_teacher" BOOLEAN NOT NULL,
    "country_code" VARCHAR(5) NOT NULL,
    "phone_num" VARCHAR(15) NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "password_last_change" TIMESTAMP(3) NOT NULL,
    "secondary_email" VARCHAR(255) NOT NULL,
    "secondary_phone_num" VARCHAR(15) NOT NULL,
    "gender" VARCHAR(5) NOT NULL,
    "student_roll_no" VARCHAR(10) NOT NULL,
    "is_independent_student" BOOLEAN NOT NULL DEFAULT false,
    "created_by" TEXT NOT NULL,
    "terms_and_condition" BOOLEAN NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectMaster" (
    "id" VARCHAR(40) NOT NULL,
    "category" VARCHAR(200) NOT NULL,
    "subCategory" VARCHAR(200) NOT NULL,
    "dicipline" VARCHAR(200) NOT NULL,
    "level" VARCHAR(200) NOT NULL,
    "subName" VARCHAR(200) NOT NULL,

    CONSTRAINT "SubjectMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" VARCHAR(40) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "subjectId" TEXT NOT NULL,
    "chapters" TEXT NOT NULL,
    "semisters" TEXT NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "categoryID" TEXT NOT NULL,
    "categoryTitle" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("categoryID")
);

-- CreateTable
CREATE TABLE "SubCategory" (
    "id" TEXT NOT NULL,
    "categoryID" TEXT NOT NULL,
    "SubCategoryID" TEXT NOT NULL,
    "SubCategoryTitle" TEXT NOT NULL,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discipline" (
    "id" TEXT NOT NULL,
    "categoryID" TEXT NOT NULL,
    "subCategoryID" TEXT NOT NULL,
    "disciplineID" TEXT NOT NULL,
    "disciplineTitle" TEXT NOT NULL,

    CONSTRAINT "Discipline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Levels" (
    "id" TEXT NOT NULL,
    "categoryID" TEXT NOT NULL,
    "subCategoryID" TEXT NOT NULL,
    "levelID" TEXT NOT NULL,
    "levelTitle" TEXT NOT NULL,

    CONSTRAINT "Levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectList" (
    "id" TEXT NOT NULL,
    "categoryID" TEXT NOT NULL,
    "subCategoryID" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "subjectTitle" TEXT NOT NULL,

    CONSTRAINT "SubjectList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_key" ON "Users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Category_categoryID_key" ON "Category"("categoryID");

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "SubjectMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_categoryID_fkey" FOREIGN KEY ("categoryID") REFERENCES "Category"("categoryID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discipline" ADD CONSTRAINT "Discipline_categoryID_fkey" FOREIGN KEY ("categoryID") REFERENCES "Category"("categoryID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discipline" ADD CONSTRAINT "Discipline_subCategoryID_fkey" FOREIGN KEY ("subCategoryID") REFERENCES "SubCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Levels" ADD CONSTRAINT "Levels_categoryID_fkey" FOREIGN KEY ("categoryID") REFERENCES "Category"("categoryID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Levels" ADD CONSTRAINT "Levels_subCategoryID_fkey" FOREIGN KEY ("subCategoryID") REFERENCES "SubCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectList" ADD CONSTRAINT "SubjectList_categoryID_fkey" FOREIGN KEY ("categoryID") REFERENCES "Category"("categoryID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectList" ADD CONSTRAINT "SubjectList_subCategoryID_fkey" FOREIGN KEY ("subCategoryID") REFERENCES "SubCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

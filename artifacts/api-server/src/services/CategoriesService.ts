import { 
    archiveCategory, 
    createCategory, 
    updateCategory,
    getCategory,
    getCategories
} from "@workspace/db/queries/categories"
import type { 
    CategoryInput, 
    CategoryListQuery 
} from "@workspace/db/queries/categories"

export const CategoriesService = {
    list(query: CategoryListQuery) {
        return getCategories(query)
    },

    find(id: string) {
        return getCategory(id)
    },

    create(data: CategoryInput) {
        return createCategory(data)
    },

    update(id: string, data: CategoryInput) {
        return updateCategory(id, data)
    },

    archive(id: string) {
        return archiveCategory(id)
    }
}

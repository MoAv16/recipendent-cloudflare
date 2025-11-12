import { supabase } from '../../../config/supabase';

/**
 * Get all recipes for the current user's company
 */
export const getRecipes = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: userData } = await supabase
      .from('users')
      .select('company_id')
      .eq('id', user.id)
      .single();

    const { data, error } = await supabase
      .from('recipes')
      .select(
        `
        *,
        folder:folders(id, name, color),
        author:users!author_id(id, first_name, last_name)
      `
      )
      .eq('company_id', userData.company_id)
      .order('usage_count', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

/**
 * Get a single recipe by ID
 */
export const getRecipeById = async (recipeId) => {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select(
        `
        *,
        folder:folders(id, name, color),
        author:users!author_id(id, first_name, last_name)
      `
      )
      .eq('id', recipeId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    throw error;
  }
};

/**
 * Create a new recipe template
 */
export const createRecipe = async (recipeData) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: userData } = await supabase
      .from('users')
      .select('company_id')
      .eq('id', user.id)
      .single();

    const { data, error } = await supabase
      .from('recipes')
      .insert({
        ...recipeData,
        company_id: userData.company_id,
        author_id: user.id,
        usage_count: 0,
      })
      .select(
        `
        *,
        folder:folders(id, name, color),
        author:users!author_id(id, first_name, last_name)
      `
      )
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating recipe:', error);
    throw error;
  }
};

/**
 * Update an existing recipe
 */
export const updateRecipe = async (recipeId, updates) => {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .update(updates)
      .eq('id', recipeId)
      .select(
        `
        *,
        folder:folders(id, name, color),
        author:users!author_id(id, first_name, last_name)
      `
      )
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw error;
  }
};

/**
 * Delete a recipe
 */
export const deleteRecipe = async (recipeId) => {
  try {
    const { error } = await supabase.from('recipes').delete().eq('id', recipeId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
};

/**
 * Increment usage count when recipe is used
 */
export const useRecipe = async (recipeId) => {
  try {
    // Increment usage count
    const { error } = await supabase.rpc('increment_recipe_usage', {
      recipe_id: recipeId,
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error incrementing recipe usage:', error);
    throw error;
  }
};

/**
 * Duplicate a recipe
 */
export const duplicateRecipe = async (recipeId) => {
  try {
    const recipe = await getRecipeById(recipeId);

    // Remove id and create new recipe
    const { id, created_at, updated_at, usage_count, author, folder, ...recipeData } = recipe;

    const newRecipe = await createRecipe({
      ...recipeData,
      name: `${recipeData.name} (Kopie)`,
    });

    return newRecipe;
  } catch (error) {
    console.error('Error duplicating recipe:', error);
    throw error;
  }
};

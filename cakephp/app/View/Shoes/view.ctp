<!-- File: /app/View/Posts/view.ctp -->

<h1><?php echo h($shoe['Shoe']['name']); ?></h1>

<p>color: <?php echo $shoe['Shoe']['color']; ?></p>

<p>size: <?php echo $shoe['Shoe']['size']; ?></p>
<p>currently in stock: <?php echo h($shoe['Shoe']['in_stock']); ?></p>
